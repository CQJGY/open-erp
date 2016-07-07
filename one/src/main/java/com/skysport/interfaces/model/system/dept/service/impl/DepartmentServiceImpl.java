package com.skysport.interfaces.model.system.dept.service.impl;

import com.skysport.core.model.common.impl.CommonServiceImpl;
import com.skysport.interfaces.bean.system.DepartmentInfo;
import com.skysport.interfaces.mapper.system.DepartmentMapper;
import com.skysport.interfaces.model.system.dept.service.IDepartmentService;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * 说明:
 * Created by zhangjh on 2015/12/30.
 */
@Service("departmentService")
public class DepartmentServiceImpl extends CommonServiceImpl<DepartmentInfo> implements IDepartmentService, InitializingBean {

    @Resource(name = "departmentMapper")
    private DepartmentMapper departmentMapper;


    @Override
    public void afterPropertiesSet() throws Exception {

        commonMapper = departmentMapper;


    }

}
