/**
 * Created by liaohuanyu on 2019/4/23.
 */
export function requestMethodsHandler(req, res){
    switch (req.method.toUpperCase()){
        case 'POST':
            update(req, res);
            break;
        case 'DELETE':
            remove(req. res);
            break;
        case 'PUT':
            create(req, res);
            break;
        case 'GET':
        default:
            get(req, res)
    }
}