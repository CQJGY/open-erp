package com.skysport.interfaces.model.info.series;

import com.skysport.core.bean.system.SelectItem2;
import com.skysport.core.bean.SpringContextHolder;
import com.skysport.core.cache.SystemBaseInfoCachedMap;
import com.skysport.interfaces.model.info.series.impl.SeriesManageServiceImpl;

import java.util.List;

/**
 * 类说明:
 * Created by zhangjh on 2015/7/7.
 */
public enum SeriesManageServiceHelper {
    SINGLETONE;

    public void refreshSelect() {
        SeriesManageServiceImpl seriesManageService = SpringContextHolder.getBean("seriesManageService");
        List<SelectItem2> seriesItems = seriesManageService.querySelectList(null);
        SystemBaseInfoCachedMap.SINGLETONE.pushBom("seriesItems", seriesItems);
        SystemBaseInfoCachedMap.SINGLETONE.pushProject("seriesItems", seriesItems);
    }
}
