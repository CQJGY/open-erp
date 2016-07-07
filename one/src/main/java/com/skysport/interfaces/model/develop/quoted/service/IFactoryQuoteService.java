package com.skysport.interfaces.model.develop.quoted.service;

import com.skysport.interfaces.bean.develop.BomInfo;
import com.skysport.interfaces.bean.develop.FactoryQuoteInfo;
import com.skysport.core.model.common.ICommonService;

import java.util.List;

/**
 * 说明:
 * Created by zhangjh on 2015/10/8.
 */
public interface IFactoryQuoteService extends ICommonService<FactoryQuoteInfo> {


    List<FactoryQuoteInfo> queryFactoryQuoteInfoList(String bomId);

    List<FactoryQuoteInfo> updateOrAddBatch(BomInfo bomInfo);
}
