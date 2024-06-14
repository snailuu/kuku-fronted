import auth from './auth'

export function setupDirective(app: App<Element>) {
    const directives = {
        auth
    }
    // 注册指令
    Object.keys(directives).forEach(name => {
        app.directive(name, directives[name])
    })
}
