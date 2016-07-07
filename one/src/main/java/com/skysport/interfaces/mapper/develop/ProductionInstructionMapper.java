package com.skysport.interfaces.mapper.develop;

import com.skysport.core.mapper.ApproveMapper;
import com.skysport.core.mapper.CommonMapper;
import com.skysport.interfaces.bean.develop.KfProductionInstructionEntity;
import org.springframework.stereotype.Repository;

/**
 * 说明:
 * Created by zhangjh on 2016/4/18.
 */
@Repository
public interface ProductionInstructionMapper extends CommonMapper<KfProductionInstructionEntity>, ApproveMapper {

    void updateProductionInstruction(KfProductionInstructionEntity productionInstruction);

    void addProductionInstruction(KfProductionInstructionEntity productionInstruction);

    KfProductionInstructionEntity queryProductionInstractionInfo(String uid);
}
