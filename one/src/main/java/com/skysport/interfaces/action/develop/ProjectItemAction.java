package com.skysport.interfaces.action.develop;

import com.skysport.core.action.BaseAction;
import com.skysport.core.annotation.SystemControllerLog;
import com.skysport.core.bean.system.SelectItem2;
import com.skysport.interfaces.bean.develop.ProjectBomInfo;
import com.skysport.interfaces.bean.form.develop.ProjectQueryForm;
import com.skysport.interfaces.constant.WebConstants;
import com.skysport.interfaces.model.common.uploadfile.IUploadFileInfoService;
import com.skysport.interfaces.model.common.uploadfile.helper.UploadFileHelper;
import com.skysport.interfaces.model.develop.project.helper.ProjectHelper;
import com.skysport.interfaces.model.develop.project.service.IProjectItemService;
import com.skysport.interfaces.model.develop.quoted.service.IQuotedService;
import com.skysport.interfaces.utils.BuildSeqNoHelper;
import com.skysport.interfaces.utils.SeqCreateUtils;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Map;

/**
 * 类说明:子项目
 * Created by zhangjh on 2015/8/26.
 */
@Scope("prototype")
@Controller
@RequestMapping("/development/project_item")
public class ProjectItemAction extends BaseAction<ProjectBomInfo> {

    @Resource(name = "projectItemManageService")
    private IProjectItemService projectItemManageService;

    @Resource(name = "quotedService")
    private IQuotedService quotedService;

    @Resource(name = "uploadFileInfoService")
    private IUploadFileInfoService uploadFileInfoService;

    /**
     * 此方法描述的是：展示list页面	 *
     *
     * @author: zhangjh
     * @version: 2015年4月29日 下午5:34:53
     */
    @RequestMapping(value = "/list")
    @ResponseBody
    @SystemControllerLog(description = "打开子项目列表页面")
    public ModelAndView search() {
        ModelAndView mav = new ModelAndView("/development/project/project-item-list");
        return mav;
    }

    /**
     * 此方法描述的是：展示add页面
     *
     * @author: zhangjh
     * @version: 2015年4月29日 下午5:34:53
     */
    @RequestMapping(value = "/add/{natrualKey}", method = RequestMethod.GET)
    @ResponseBody
    @SystemControllerLog(description = "新增子项目")
    public ModelAndView add(@PathVariable String natrualKey, HttpServletRequest request) {
        String taskId = (String) request.getAttribute("taskId");
        String processInstanceId = (String) request.getAttribute("processInstanceId");
        ModelAndView mav = new ModelAndView("/development/project/project-item-add");
        mav.addObject("natrualkey", natrualKey);
        mav.addObject("taskId", taskId);
        mav.addObject("processInstanceId", processInstanceId);
        return mav;
    }


    /**
     * @return 导出报价表
     * @throws IOException
     */
    @RequestMapping("/download_offer/{natrualkeys}")
    @SystemControllerLog(description = "导出报价表")
    public ModelAndView downloadOffer(@PathVariable String natrualkeys, HttpServletRequest request, HttpServletResponse response) throws IOException, InvalidFormatException {
        quotedService.downloadOffer(request, response, natrualkeys);
        return null;
    }


    /**
     * @return 导出面辅料详细
     * @throws IOException
     */
    @RequestMapping("/export_materialdetail/{natrualkeys}")
    @SystemControllerLog(description = "导出面辅料详细")
    public ModelAndView exportMaterialDetail(@PathVariable String natrualkeys, HttpServletRequest request, HttpServletResponse response) throws InvocationTargetException, NoSuchMethodException, IOException, IllegalAccessException, InvalidFormatException {
        String resourcePath = WebConstants.RESOURCE_PATH_BOM;
        String fileTypeName = WebConstants.BOM_DETAIL_CN_NAME;
        projectItemManageService.exportMaterialDetail(request, response, natrualkeys,resourcePath,fileTypeName);
        return null;
    }

    /**
     * @return 导出采购表
     * @throws IOException
     */
    @RequestMapping("/export_materialpurchasedetail/{natrualkeys}")
    @SystemControllerLog(description = "导出采购详细")
    public ModelAndView exportMaterialPurchaseDetail(@PathVariable String natrualkeys, HttpServletRequest request, HttpServletResponse response) throws InvocationTargetException, NoSuchMethodException, IOException, IllegalAccessException, InvalidFormatException {
        String resourcePath = WebConstants.RESOURCE_PATH_PURCHASE;
        String fileTypeName = WebConstants.BOM_PURCHASE_CN_NAME;
        projectItemManageService.exportMaterialDetail(request, response, natrualkeys,resourcePath,fileTypeName);

        return null;
    }

    /**
     * 此方法描述的是：
     *
     * @author: zhangjh
     * @version: 2015年4月29日 下午5:34:53
     */
    @RequestMapping(value = "/search")
    @ResponseBody
    @SystemControllerLog(description = "查询子项目信息列表")
    public Map<String, Object> search(HttpServletRequest request) {
        //组件queryFory的参数
        ProjectQueryForm queryForm = new ProjectQueryForm();
        queryForm.setDataTablesInfo(convertToDataTableQrInfo(WebConstants.PROJECT_ITEM_TABLE_COLUMN, request));
        ProjectBomInfo bomInfo = ProjectHelper.SINGLETONE.getProjectBomInfo(request);
        queryForm.setProjectBomInfo(bomInfo);
        Map<String, Object> resultMap = buildSearchJsonMap(queryForm, request, projectItemManageService);
        return resultMap;
    }

    @Override
    public void turnIdToName(List<ProjectBomInfo> infos) {
        ProjectHelper.SINGLETONE.turnIdToName(infos);
    }

    /**
     * 此方法描述的是：
     *
     * @author: zhangjh
     * @version: 2015年4月29日 下午5:35:09
     */
    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    @ResponseBody
    @SystemControllerLog(description = "子项目")
    public Map<String, Object> edit(@RequestBody ProjectBomInfo info) {

        projectItemManageService.edit(info);
        return rtnSuccessResultMap("更新成功");

    }


    /**
     * 此方法描述的是：项目新增
     *
     * @author: zhangjh
     * @version: 2015年4月29日 下午5:35:09
     */
    @RequestMapping(value = "/new", method = RequestMethod.POST)
    @ResponseBody
    @SystemControllerLog(description = "增加子项目")
    public Map<String, Object> add(ProjectBomInfo info) {

        String kind_name = ProjectHelper.SINGLETONE.buildKindName(info);
        String seqNo = BuildSeqNoHelper.SINGLETONE.getFullSeqNo(kind_name, WebConstants.PROJECT_SEQ_NO_LENGTH);

//        //年份+客户+地域+系列+NNN
//        String projectId = kind_name + seqNo;
        String projectId = SeqCreateUtils.SINGLETONE.newRrojectSeq(info.getSeriesId());
        //设置ID
        info.setNatrualkey(projectId);
        info.setSeqNo(seqNo);

        //保存项目信息
        projectItemManageService.add(info);
        return rtnSuccessResultMap("新增成功");

    }


    /**
     * @param natrualKey 主键id
     * @return 根据主键id找出详细信息
     */
    @RequestMapping(value = "/info/{natrualKey}", method = RequestMethod.GET)
    @ResponseBody
    @SystemControllerLog(description = "查询子项目")
    public ProjectBomInfo info(@PathVariable String natrualKey) {

        ProjectBomInfo info = projectItemManageService.queryInfoByNatrualKey(natrualKey);
        projectItemManageService.setStatuCodeAlive(info, natrualKey);
        if (null != info) {
            Map<String, Object> fileinfosMap = UploadFileHelper.SINGLETONE.getFileInfoMap(uploadFileInfoService, natrualKey);
            info.setFileinfosMap(fileinfosMap);
        }
        return info;
    }

    /**
     * @param natrualKey
     * @return
     */
    @RequestMapping(value = "/del/{natrualKey}", method = RequestMethod.DELETE)
    @ResponseBody
    @SystemControllerLog(description = "删除子项目")
    public Map<String, Object> del(@PathVariable String natrualKey) {
        projectItemManageService.del(natrualKey);
        return rtnSuccessResultMap("删除成功");
    }


    @RequestMapping(value = "/select", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> querySelectList(HttpServletRequest request) {
        String name = request.getParameter("name");
        List<SelectItem2> commonBeans = projectItemManageService.querySelectList(name);
        return rtSelectResultMap(commonBeans);
    }
}
