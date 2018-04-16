/**
* page 分页对象
*/
module.exports = function(currentPage, pageSize){
    return {
        currentPage: currentPage,
        pageSize: pageSize,
        _totalRecord: 0,
        totalPage: 0,
        records:{},
        getRecordStart: function(){
            if (this.currentPage > 0) {
                return (this.currentPage - 1) * this.pageSize;
            } else {
                return 0;
            }
        },
        getRecordEnd: function(){
            if (this.currentPage >= 0) {
                return this.currentPage * this.pageSize;
            } else {
                return 0;
            }
        },
        setTotalRecord: function(totalRecord){
            this._totalRecord = totalRecord;
            this.setTotalPage();
        },
        setTotalPage: function(){
            this.totalPage =  Math.ceil((this._totalRecord * 1.0) / this.pageSize);
            if (this._totalRecord % this.pageSize != 0) {
                this._totalRecord++;
            }
            if (this.totalPage == 0) {
                this._totalRecord = 1;
            }
        }
    }
};