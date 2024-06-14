/**
 * 计算table序号
 * @param res
 * @param pagination
 */
export function calcTableIndex(res:any,pagination:any) {
   return (res.list || []).map((p: any, i: number) => {
        p._tableIndex = 1 + i + (pagination.pageIndex - 1) * pagination.pageSize;
        return p;
    });
}















