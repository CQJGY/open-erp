package com.skysport.interfaces.action.info.base;

import com.skysport.core.action.BaseAction;
import com.skysport.core.annotation.SystemControllerLog;
import com.skysport.core.bean.page.DataTablesInfo;
import com.skysport.core.bean.system.SelectItem;
import com.skysport.core.model.seqno.service.IncrementNumberService;
import com.skysport.interfaces.constant.WebConstants;
import com.skysport.interfaces.bean.info.ProductTypeInfo;
import com.skysport.core.model.common.ICommonService;
import com.skysport.interfaces.model.info.product_type.ProductTypeManageServiceHelper;
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
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 类描述的是：品名
 * Created by zhangjh on 2015/6/9.
 */
@Scope("prototype")
@Controller
@RequestMapping("/system/product_type")
public class ProductTypeAction extends BaseAction<ProductTypeInfo> {


    @Resource(name = "productTypeManageService")
    private ICommonService productTypeManageService;

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
    @SystemControllerLog(description = "点击品名菜单")
    public ModelAndView search() {
        ModelAndView mav = new ModelAndView("/system/product_type/list");
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
    @SystemControllerLog(description = "查询品名信息列表")
    public Map<String, Object> search(HttpServletRequest request) {
        // HashMap<String, String> paramMap = convertToMap(params);
        DataTablesInfo dataTablesInfo = convertToDataTableQrInfo(WebConstants.PRODUCT_TYPE_TABLE_COLUMN, request);
        // 总记录数
        int recordsTotal = productTypeManageService.listInfosCounts();
        int recordsFiltered = recordsTotal;
        if (!StringUtils.isBlank(dataTablesInfo.getSearchValue())) {
            recordsFiltered = productTypeManageService.listFilteredInfosCounts(dataTablesInfo);
        }
        int draw = Integer.parseInt(request.getParameter("draw"));
        List<ProductTypeInfo> product_typeInfos = productTypeManageService.searchInfos(dataTablesInfo);
        Map<String, Object> resultMap = buildSearchJsonMap(product_typeInfos, recordsTotal, recordsFiltered, draw);

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
    @SystemControllerLog(description = "编辑品名")
    public Map<String, Object> edit(ProductTypeInfo product_typeInfo, HttpServletRequest request,
                                    HttpServletResponse respones) {
        productTypeManageService.edit(product_typeInfo);

        ProductTypeManageServiceHelper.SINGLETONE.refreshSelect();
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
    @SystemControllerLog(description = "增加品名")
    public Map<String, Object> add(ProductTypeInfo product_typeInfo, HttpServletRequest request) {
        String currentNo = productTypeManageService.queryCurrentSeqNo();
        //设置ID
        product_typeInfo.setNatrualkey(BuildSeqNoHelper.SINGLETONE.getNextSeqNo(WebConstants.PRODUCT_TYPE_INFO, currentNo, incrementNumberService));
        productTypeManageService.add(product_typeInfo);

        ProductTypeManageServiceHelper.SINGLETONE.refreshSelect();
        return rtnSuccessResultMap("新增成功");
    }


    /**
     * @param natrualKey 主键id
     * @return 根据主键id找出详细信息
     */
    @RequestMapping(value = "/info/{natrualKey}", method = RequestMethod.GET)
    @ResponseBody
    @SystemControllerLog(description = "查询品名信息")
    public ProductTypeInfo info(@PathVariable String natrualKey) {
        ProductTypeInfo product_typeInfo = (ProductTypeInfo) productTypeManageService.queryInfoByNatrualKey(natrualKey);
        return product_typeInfo;
    }

    /**
     * @param natrualKey
     * @return 删除
     */
    @RequestMapping(value = "/del/{natrualKey}", method = RequestMethod.DELETE)
    @ResponseBody
    @SystemControllerLog(description = "删除品名")
    public Map<String, Object> del(@PathVariable String natrualKey) {
        productTypeManageService.del(natrualKey);
        ProductTypeManageServiceHelper.SINGLETONE.refreshSelect();
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
        List<SelectItem> commonBeans = productTypeManageService.querySelectList(name);
        Map<String, Object> resultMap = new HashMap<String, Object>();
        resultMap.put("items", commonBeans);
        resultMap.put("total_count", commonBeans.size());
        return resultMap;
    }
}
