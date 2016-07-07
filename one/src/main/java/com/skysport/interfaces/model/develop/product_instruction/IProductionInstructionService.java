package com.skysport.interfaces.model.develop.product_instruction;

import com.skysport.core.model.common.ICommonService;
import com.skysport.interfaces.bean.develop.KfProductionInstructionEntity;

/**
 * 说明:
 * Created by zhangjh on 2016/4/18.
 */
public interface IProductionInstructionService extends ICommonService<KfProductionInstructionEntity> {
    KfProductionInstructionEntity getInfoOrNeedtoAdd(String bomId);
//    KfProductionInstructionEntity updateOrAddBatch(KfProductionInstructionEntity productionInstruction);
}
