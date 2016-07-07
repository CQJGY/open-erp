package com.skysport.interfaces.model.info.factory;

import com.skysport.core.bean.system.SelectItem2;
import com.skysport.core.bean.SpringContextHolder;
import com.skysport.core.cache.SystemBaseInfoCachedMap;

import java.util.List;

/**
 * 类说明:
 * Created by zhangjh on 2015/7/7.
 */
public enum FactoryManageServiceHelper {
    SINGLETONE;

    public void refreshSelect() {
        FactoryManageServiceImpl factoryManageService = SpringContextHolder.getBean("factoryManageService");
        List<SelectItem2> factoryItems = factoryManageService.querySelectList(null);
        SystemBaseInfoCachedMap.SINGLETONE.pushBom("factoryItems", factoryItems);
    }
}
