package com.skysport.interfaces.action.info.base;

import com.skysport.core.action.BaseAction;
import com.skysport.core.annotation.SystemControllerLog;
import com.skysport.core.bean.page.DataTablesInfo;
import com.skysport.core.bean.system.SelectItem2;
import com.skysport.interfaces.constant.WebConstants;
import com.skysport.core.model.seqno.service.IncrementNumberService;
import com.skysport.interfaces.bean.info.SexInfo;
import com.skysport.core.model.common.ICommonService;
import com.skysport.interfaces.model.info.sex.SexManageServiceHelper;
import com.skysport.interfaces.utils.BuildSeqNoHelper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 类描述的是：性别属性
 * Created by zhangjh on 2015/6/17.
 */
@Scope("prototype")
@Controller
@RequestMapping("/system/sex")
public class SexAction extends BaseAction<SexInfo> {


    @Resource(name = "sexManageService")
    private ICommonService sexManageService;

    @Resource(name = "incrementNumber")
    private IncrementNumberService incrementNumberService;

    /**
     * 此方法描述的是：展示list页面
     *
     * @author: zhangjh
     * @version: 2015年4月29日 下午5:34:53
     */
    @RequestMapping(value = "/list")
    @ResponseBody
    @SystemControllerLog(description = "点击性别属性菜单")
    public ModelAndView search() {
        ModelAndView mav = new ModelAndView("/system/sex/list");
        return mav;
    }


    /**
     * 此方法描述的是：查询数据集
     *
     * @author: zhangjh
     * @version: 2015年4月29日 下午5:34:53
     */
    @RequestMapping(value = "/search")
    @ResponseBody
    @SystemControllerLog(description = "查询性别属性信息列表")
    public Map<String, Object> search(HttpServletRequest request) {
        // HashMap<String, String> paramMap = convertToMap(params);
        DataTablesInfo dataTablesInfo = convertToDataTableQrInfo(WebConstants.SEX_TABLE_COLUMN, request);
        // 总记录数
        int recordsTotal = sexManageService.listInfosCounts();
        int recordsFiltered = recordsTotal;
        if (!StringUtils.isBlank(dataTablesInfo.getSearchValue())) {
            recordsFiltered = sexManageService.listFilteredInfosCounts(dataTablesInfo);
        }
        int draw = Integer.parseInt(request.getParameter("draw"));
        List<SexInfo> sexInfos = sexManageService.searchInfos(dataTablesInfo);
        Map<String, Object> resultMap = buildSearchJsonMap(sexInfos, recordsTotal, recordsFiltered, draw);

        return resultMap;
    }

    /**
     * 此方法描述的是：编辑信息
     *
     * @author: zhangjh
     * @version: 2015年4月29日 下午5:35:09
     */
    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    @ResponseBody
    @SystemControllerLog(description = "编辑性别属性")
    public Map<String, Object> edit(SexInfo sexInfo, HttpServletRequest request) {
        sexManageService.edit(sexInfo);

        SexManageServiceHelper.SINGLETONE.refreshSelect();
        return rtnSuccessResultMap("更新成功");
    }


    /**
     * 此方法描述的是：新增
     *
     * @author: zhangjh
     * @version: 2015年4月29日 下午5:35:09
     */
    @RequestMapping(value = "/new", method = RequestMethod.POST)
    @ResponseBody
    @SystemControllerLog(description = "新增性别属性")
    public Map<String, Object> add(SexInfo sexInfo, HttpServletRequest request) {
        String currentNo = sexManageService.queryCurrentSeqNo();
        //设置ID
        sexInfo.setNatrualkey(BuildSeqNoHelper.SINGLETONE.getNextSeqNo(WebConstants.SEX_INFO, currentNo, incrementNumberService));
        sexManageService.add(sexInfo);

        SexManageServiceHelper.SINGLETONE.refreshSelect();
        Map<String, Object> resultMap = new HashMap<String, Object>();
        resultMap.put("code", "0");
        resultMap.put("message", "新增成功");
        return resultMap;
    }


    /**
     * @param natrualKey 主键id
     * @return 根据主键id找出详细信息
     */
    @RequestMapping(value = "/info/{natrualKey}", method = RequestMethod.GET)
    @ResponseBody
    @SystemControllerLog(description = "查询性别属性信息")
    public SexInfo info(@PathVariable String natrualKey) {
        SexInfo sexInfo = (SexInfo) sexManageService.queryInfoByNatrualKey(natrualKey);
        return sexInfo;
    }

    /**
     * @param natrualKey
     * @return 删除
     */
    @RequestMapping(value = "/del/{natrualKey}", method = RequestMethod.DELETE)
    @ResponseBody
    @SystemControllerLog(description = "删除性别属性")
    public Map<String, Object> del(@PathVariable String natrualKey) {
        sexManageService.del(natrualKey);
        SexManageServiceHelper.SINGLETONE.refreshSelect();
        return rtnSuccessResultMap("删除成功");
    }

    /**
     * @param request
     * @return
     */
    @RequestMapping(value = "/select", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> querySelectList(HttpServletRequest request) {
        String name = request.getParameter("name");
        List<SelectItem2> commonBeans = sexManageService.querySelectList(name);
        return rtSelectResultMap(commonBeans);
    }
}
