package com.skysport.interfaces.mapper.info;

import com.skysport.core.mapper.CommonMapper;
import com.skysport.interfaces.bean.develop.SexColor;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 说明:
 * Created by zhangjh on 2015/11/11.
 */
@Repository("sexColorMapper")
public interface SexColorMapper extends CommonMapper<SexColor> {

    List<SexColor> searchInfosByProjectId(@Param(value = "projectId") String projectId);

    void updateSexColorByProjectIdAndSexId(SexColor sexColor);

    void delByProjectId(@Param(value = "projectId") String projectId);

    SexColor searchSexColorByProjectIdAndSexId(@Param(value = "projectId") String projectId, @Param(value = "sexIdChild") String sexId);
}
