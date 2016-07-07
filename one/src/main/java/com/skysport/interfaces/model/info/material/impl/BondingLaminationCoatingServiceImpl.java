package com.skysport.interfaces.model.info.material.impl;

import com.skysport.core.model.common.impl.CommonServiceImpl;
import com.skysport.interfaces.bean.info.BondingLaminationCoatingInfo;
import com.skysport.interfaces.mapper.info.material.BondingLaminationCoatingMapper;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * 类说明:复合或涂层
 * Created by zhangjh on 2015/6/25.
 */
@Service("bondingLaminationCoatingService")
public class BondingLaminationCoatingServiceImpl extends CommonServiceImpl<BondingLaminationCoatingInfo> implements InitializingBean {
    @Resource(name = "bondingLaminationCoatingMapper")
    private BondingLaminationCoatingMapper bondingLaminationCoatingMapper;

    @Override
    public void afterPropertiesSet() {
        commonMapper = bondingLaminationCoatingMapper;
    }
}
