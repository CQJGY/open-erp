package com.skysport.interfaces.bean.form.develop;

import com.skysport.interfaces.bean.develop.QuotedInfo;
import com.skysport.interfaces.bean.form.BaseQueyrForm;

/**
 * 说明:
 * Created by zhangjh on 2016/4/14.
 */
public class PreQuoteQueryForm extends BaseQueyrForm {

    private QuotedInfo quoteInfo;

    public QuotedInfo getQuoteInfo() {
        return quoteInfo;
    }

    public void setQuoteInfo(QuotedInfo quoteInfo) {
        this.quoteInfo = quoteInfo;
    }
}
