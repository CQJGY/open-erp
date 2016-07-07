package com.skysport.interfaces.mapper.info;

import com.skysport.core.bean.system.SelectItem2;
import com.skysport.core.mapper.CommonMapper;
import com.skysport.interfaces.bean.info.CategoryInfo;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 类说明:
 * Created by zhangjh on 2015/7/2.
 */
@Repository("categoryMapper")
public interface CategoryMapper extends CommonMapper<CategoryInfo> {
    /**
     * 查询指定级别的品类
     *
     * @param levelId 级别的品类
     */
    List<SelectItem2> querySelectListByLevelId(String levelId);

    List<CategoryInfo> searchChildCategoryByCategoryId(@Param(value = "categoryId") String categoryId);
}
