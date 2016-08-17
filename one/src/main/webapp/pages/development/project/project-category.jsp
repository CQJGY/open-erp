<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<script id="category-template" type="text/x-handlebars-template">
    {{#each category}}
    <div class="form-group" id="{{categoryDivId}}">
        <label class="col-xs-2  control-label" for="{{categoryAname}}">一级品类</label>
        <div class="col-xs-3">
            <input type="hidden" id="{{categoryAidChild}}" name="categoryAidChild"/>
            <input type="text" id="{{categoryAname}}" name="categoryAname" readonly="readonly" class="col-xs-10 col-sm-12"/>
        </div>

        <label class="col-xs-2  control-label" for="{{categoryBid}}"> 二级品类 <a href="#" target="_blank">&nbsp;</a></label>
        <div class="col-xs-3">
            <select data-style="btn-info" class="selectpicker show-menu-arrow" data-width="100%"      id="{{categoryBid}}" multiple placeholder="品类二级名称">"
            </select>
            <a href="javascript:openChildW('<%=path%>/system/category/list')" target="_blank">+</a>
        </div>


    </div>

    {{/each}}
</script>