package com.skysport.interfaces.model.develop.project.service.impl;

import com.skysport.interfaces.bean.develop.ProjectCategoryInfo;
import com.skysport.interfaces.mapper.develop.ProjectCategoryMapper;
import com.skysport.core.model.common.impl.CommonServiceImpl;
import com.skysport.interfaces.model.develop.project.service.IProjectCategoryManageService;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * 类说明:
 * Created by zhangjh on 2015/8/26.
 */
@Service("projectCategoryManageService")
public class ProjectCategoryManageServiceImpl extends CommonServiceImpl<ProjectCategoryInfo> implements IProjectCategoryManageService, InitializingBean {

    @Resource(name = "projectCategoryMapper")
    private ProjectCategoryMapper projectCategoryMapper;

    @Override
    public void afterPropertiesSet() throws Exception {
        commonMapper = projectCategoryMapper;

    }

    @Override
    public List<ProjectCategoryInfo> queryProjectCategoryInfo(String natrualKey) {
        return projectCategoryMapper.queryProjectCategoryInfo(natrualKey);
    }
}
