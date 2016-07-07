package com.skysport.interfaces.model.info.material_type.impl;

import com.skysport.interfaces.bean.info.MaterialTypeInfo;
import com.skysport.interfaces.mapper.info.MaterialTypeMapper;
import com.skysport.core.model.common.impl.CommonServiceImpl;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * Created by zhangjh on 2015/6/9.
 */
@Service("materialTypeManageService")
public class MaterialTypeManageServiceImpl extends CommonServiceImpl<MaterialTypeInfo> implements InitializingBean {
    @Resource(name = "materialTypeMapper")
    private MaterialTypeMapper materialTypeMapper;

    @Override
    public void afterPropertiesSet() {
        commonMapper = materialTypeMapper;
    }
}
