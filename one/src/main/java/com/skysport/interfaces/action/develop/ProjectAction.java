package com.skysport.interfaces.action.develop;

import com.skysport.core.action.BaseAction;
import com.skysport.core.annotation.SystemControllerLog;
import com.skysport.core.bean.system.SelectItem2;
import com.skysport.interfaces.bean.develop.ProjectBomInfo;
import com.skysport.interfaces.bean.develop.ProjectInfo;
import com.skysport.interfaces.bean.form.develop.ProjectQueryForm;
import com.skysport.interfaces.constant.WebConstants;
import com.skysport.interfaces.model.common.uploadfile.IUploadFileInfoService;
import com.skysport.interfaces.model.common.uploadfile.helper.UploadFileHelper;
import com.skysport.interfaces.model.develop.project.helper.ProjectHelper;
import com.skysport.interfaces.model.develop.project.service.IProjectService;
import com.skysport.interfaces.model.develop.quoted.service.IQuotedService;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * 项目维护
 * Created by zhangjh on 2015/6/23.
 */
@Scope("prototype")
@Controller
@RequestMapping("/development/project")
public class ProjectAction extends BaseAction<ProjectInfo> {

    @Resource(name = "projectManageService")
    private IProjectService projectManageService;

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
    @SystemControllerLog(description = "打开主项目列表页面")
    public ModelAndView search() {
        ModelAndView mav = new ModelAndView("/development/project/project-list");
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
    @SystemControllerLog(description = "打开主项目新增页面")
    public ModelAndView add(@PathVariable String natrualKey) {

        ModelAndView mav = new ModelAndView("/development/project/project-add");
        mav.addObject("natrualkey", natrualKey);
        return mav;

    }


    /**
     * 此方法描述的是：列表
     *
     * @author: zhangjh
     * @version: 2015年4月29日 下午5:34:53
     */
    @RequestMapping(value = "/search")
    @ResponseBody
    @SystemControllerLog(description = "查询主项目列表")
    public Map<String, Object> search(HttpServletRequest request) {

        //组件queryFory的参数
        ProjectQueryForm queryForm = new ProjectQueryForm();
        queryForm.setDataTablesInfo(convertToDataTableQrInfo(WebConstants.PROJECT_TABLE_COLUMN, request));
        ProjectBomInfo bomInfo = ProjectHelper.SINGLETONE.getProjectBomInfo(request);
        queryForm.setProjectBomInfo(bomInfo);
        Map<String, Object> resultMap = buildSearchJsonMap(queryForm, request, projectManageService);
        return resultMap;

    }

    @Override
    public void turnIdToName(List<ProjectInfo> infos) {
        ProjectHelper.SINGLETONE.turnIdToNameInPorject(infos);
    }


    /**
     * 此方法描述的是：
     *
     * @author: zhangjh
     * @version: 2015年4月29日 下午5:35:09
     */
    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    @ResponseBody
    @SystemControllerLog(description = "修改主项目信息")
    public Map<String, Object> edit(@RequestBody ProjectInfo info) {

        projectManageService.edit(info);

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
    @SystemControllerLog(description = "新增主项目信息")
    public Map<String, Object> add(@RequestBody ProjectInfo info, HttpServletRequest request) {
        //保存项目信息
        projectManageService.add(info);
        return rtnSuccessResultMap("新增成功");
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
     * @param natrualKey 主键id
     * @return 根据主键id找出详细信息
     */
    @RequestMapping(value = "/info/{natrualKey}", method = RequestMethod.GET)
    @ResponseBody
    @SystemControllerLog(description = "查询主项目信息")
    public ProjectInfo info(@PathVariable String natrualKey) {
        ProjectInfo info = projectManageService.queryInfoByNatrualKey(natrualKey);
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
    @SystemControllerLog(description = "删除主项目信息")
    public Map<String, Object> del(@PathVariable String natrualKey) {
        projectManageService.del(natrualKey);
        return rtnSuccessResultMap("删除成功");
    }

    @RequestMapping(value = "/select", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> querySelectList(HttpServletRequest request) {
        String name = request.getParameter("name");
        List<SelectItem2> commonBeans = projectManageService.querySelectList(name);
        return rtSelectResultMap(commonBeans);
    }


}
