package com.skysport.interfaces.model.develop.project.service.impl;

import com.skysport.core.bean.permission.UserInfo;
import com.skysport.core.model.common.impl.CommonServiceImpl;
import com.skysport.core.utils.UserUtils;
import com.skysport.interfaces.bean.common.UploadFileInfo;
import com.skysport.interfaces.bean.develop.ProjectCategoryInfo;
import com.skysport.interfaces.bean.develop.ProjectInfo;
import com.skysport.interfaces.bean.form.BaseQueyrForm;
import com.skysport.interfaces.bean.form.develop.ProjectQueryForm;
import com.skysport.interfaces.constant.WebConstants;
import com.skysport.interfaces.mapper.develop.ProjectMapper;
import com.skysport.interfaces.model.common.uploadfile.IUploadFileInfoService;
import com.skysport.interfaces.model.common.uploadfile.helper.UploadFileHelper;
import com.skysport.interfaces.model.develop.project.helper.ProjectHelper;
import com.skysport.interfaces.model.develop.project.service.IProjectCategoryManageService;
import com.skysport.interfaces.model.develop.project.service.IProjectItemService;
import com.skysport.interfaces.model.develop.project.service.IProjectService;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * 类说明:
 * Created by zhangjh on 2015/7/13.
 */
@Service("projectManageService")
public class ProjectServiceImpl extends CommonServiceImpl<ProjectInfo> implements IProjectService, InitializingBean {

    @Resource(name = "projectMapper")
    private ProjectMapper projectMapper;

    @Resource(name = "projectCategoryManageService")
    private IProjectCategoryManageService projectCategoryManageService;

    @Resource(name = "projectItemManageService")
    private IProjectItemService projectItemManageService;

    @Resource(name = "uploadFileInfoService")
    private IUploadFileInfoService uploadFileInfoService;


    @Override
    public void afterPropertiesSet() {
        commonMapper = projectMapper;
    }

    @Override
    public String queryCurrentSeqNo(ProjectInfo info) {
        return projectMapper.queryCurrentSeqNo(info);
    }

    @Override
    public void add(ProjectInfo info) {
        UserInfo userInfo = UserUtils.getUserFromSession();
        String aliases = userInfo.getAliases();
        List<UploadFileInfo> fileInfos = info.getFileInfos();
        UploadFileHelper.SINGLETONE.updateFileRecords(fileInfos, info.getNatrualkey(), uploadFileInfoService, WebConstants.FILE_KIND_PROJECT);
        //新增项目时组装项目名等信息
        ProjectHelper.SINGLETONE.buildProjectInfo(info);
        info.setCreater(aliases);

        //组装项目品类信息
        info = ProjectHelper.SINGLETONE.buildProjectCategoryInfo(info);

        //增加主项目信息
        super.add(info);
        //增加项目的品类信息
        addBatchCategoryInfos(info.getCategoryInfos());

        projectItemManageService.dealProjectItemsOnProjectChanged(info);
    }


    /**
     * 项目编号是由年份+客户+地域+系列+NNN构成，但是上面的信息可能会更改，如果按照这个这个规则，项目编号应该要更改才对，但目前的处理方式是，项目编号和序号都不改变
     *
     * @param info
     */
    @Override
    public void edit(ProjectInfo info) {


        List<UploadFileInfo> fileInfos = info.getFileInfos();
        UploadFileHelper.SINGLETONE.updateFileRecords(fileInfos, info.getNatrualkey(), uploadFileInfoService, WebConstants.FILE_KIND_PROJECT);
        ProjectHelper.SINGLETONE.buildProjectInfo(info);

        //更新t_project表
        super.edit(info);

        delInfoAboutProject(info.getNatrualkey());
        addBatchCategoryInfos(info.getCategoryInfos());

        projectItemManageService.dealProjectItemsOnProjectChanged(info);


    }

    private void addBatchCategoryInfos(List<ProjectCategoryInfo> categoryInfos) {
        //增加项目的品类信息
        projectCategoryManageService.addBatch(categoryInfos);
    }

    private void delInfoAboutProject(String natrualkey) {
        //删除项目相关的所有信息
        projectMapper.delInfoAboutProject(natrualkey);
    }

    @Override
    public int listFilteredInfosCounts(BaseQueyrForm queryForm) {
        return projectMapper.listFilteredInfosCounts(queryForm);
    }

    @Override
    public List<ProjectInfo> searchInfos(ProjectQueryForm queryForm) {
        return projectMapper.searchInfos(queryForm);
    }


}
