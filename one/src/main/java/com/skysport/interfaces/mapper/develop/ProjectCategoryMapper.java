package com.skysport.interfaces.mapper.develop;

import com.skysport.core.mapper.CommonMapper;
import com.skysport.interfaces.bean.develop.ProjectCategoryInfo;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 类说明:
 * Created by zhangjh on 2015/8/26.
 */
@Repository("projectCategoryMapper")
public interface ProjectCategoryMapper extends CommonMapper<ProjectCategoryInfo> {


    List<ProjectCategoryInfo> queryProjectCategoryInfo(String natrualKey);
}
