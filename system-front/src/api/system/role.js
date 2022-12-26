import request from '@/utils/request'


const api_name='/admin/system/sysRole'

export default{
    getPageList(page,limit,searchObj){
        return request({
            //url: '/admin/system/sysRole'+page+'/'+limit,
            url: `${api_name}/${page}/${limit}`,
            method: 'get',
            //params传递参数数据
            params: searchObj
        })
    },
    removeById(id){
        return request({
            //url: '/admin/system/sysRole'+page+'/'+limit,
            url: `${api_name}/remove/${id}`,
            method: 'delete'
        })
    },
    saveRole(role){
        return request({
            //url: '/admin/system/sysRole'+page+'/'+limit,
            url: `${api_name}/save`,
            method: 'post',
            //data传递json格式数据
            data: role
        })
    },
    updateRole(role){
        return request({
            //url: '/admin/system/sysRole'+page+'/'+limit,
            url: `${api_name}/update`,
            method: 'post',
            //data传递json格式数据
            data: role
        })
    },
    findRoleById(id){
        return request({
            url: `${api_name}/findRoleById/${id}`,
            method: 'post'
        })
    },
    BatchRemove(ids){
        return request({
            //url: '/admin/system/sysRole'+page+'/'+limit,
            url: `${api_name}/batchRemove`,
            method: 'delete',
            data:ids
        })
    }
}

// export function getList(params) {
//   return request({
//     url: '/vue-admin-template/table/list',
//     method: 'get',
//     params
//   })
// }
