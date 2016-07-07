package com.skysport.core.model.login.service.impl;

import com.skysport.core.bean.permission.UserInfo;
import com.skysport.core.model.login.service.IUserService;
import com.skysport.interfaces.mapper.permission.UserInfoMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * 此类描述的是：
 *
 * @author: zhangjh
 * @version: 2015年4月30日 上午9:38:22
 */
@Service("userService")
public class UserServiceImpl implements IUserService {

    @Resource(name = "userInfoMapper")
    private UserInfoMapper userInfoMapper;

    @Override
    public UserInfo queryInfoByUserInfoName(String userName) {
        return userInfoMapper.queryInfoByUserInfoName(userName);
    }

    @Override
    public UserInfo queryInfo(String userId) {
        return userInfoMapper.queryInfo(userId);
    }
}
