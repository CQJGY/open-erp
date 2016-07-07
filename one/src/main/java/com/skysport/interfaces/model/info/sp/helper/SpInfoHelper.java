package com.skysport.interfaces.model.info.sp.helper;

import com.skysport.core.bean.system.SelectItem2;
import com.skysport.core.bean.SpringContextHolder;
import com.skysport.core.cache.SystemBaseInfoCachedMap;
import com.skysport.interfaces.bean.info.SpInfo;
import com.skysport.interfaces.constant.WebConstants;
import com.skysport.interfaces.utils.SelectInfoHelper;
import com.skysport.interfaces.model.info.sp.service.impl.SpManageServiceImpl;

import java.util.List;

/**
 * Created by zhangjh on 2015/6/1.
 */
public enum SpInfoHelper {
    /**
     *
     */
    SINGLETONE;

    public void refreshSelect() {
        SpManageServiceImpl spManageService = SpringContextHolder.getBean("spManageService");
        List<SelectItem2> spItems = spManageService.querySelectList(null);
        SystemBaseInfoCachedMap.SINGLETONE.pushBom(WebConstants.SPITEMS, spItems);
    }


    public String turnSpIdToName(String spId) {
        List<SelectItem2> selectItem2s = SystemBaseInfoCachedMap.SINGLETONE.popBom(WebConstants.SPITEMS);
        String spName = SystemBaseInfoCachedMap.SINGLETONE.getName(selectItem2s, spId);
        return spName;
    }

    /**
     * 将材料类型id转换成材料名称，存放在id字段
     *
     * @param spInfos
     */
    public void turnMaterialTypeIdToName(List<SpInfo> spInfos) {
        if (null != spInfos) {
            List<SelectItem2> selectItems = SelectInfoHelper.findSelectItemsByItemsName(WebConstants.MATERIALTYPEITEMS);
            for (SpInfo spInfo : spInfos) {
                String typeId = spInfo.getType();
                for (SelectItem2 item : selectItems) {
                    String id = item.getNatrualkey();
                    if (id.equals(typeId)) {
                        spInfo.setType(item.getName());
                        break;
                    }
                }
            }
        }
    }
}
