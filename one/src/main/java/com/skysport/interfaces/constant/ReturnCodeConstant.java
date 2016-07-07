package com.skysport.interfaces.constant;

/**
 * 说明:开发模块的返回码
 * Created by zhangjh on 2015/9/2.
 */
public enum ReturnCodeConstant {
    SYS_EXP("100001", "系统内部异常"),

    PROJECT_CANNOT_EDIT("100004", "不能修改主项目信息"),

    UPDATE_BOM_MAINCOLOR_PARAM_EXP("100005", "修改bom主颜色时，传输的信息有误"),

    USER_IS_NOT_LOGINED("100006", "用户没有登录"),
    UNCLAIM_TASK("100007", "不能反签收"),;

    private String code;

    private String msg;


    ReturnCodeConstant(String code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
