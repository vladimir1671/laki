import { Meteor } from 'meteor/meteor';

function waiting() {
    $('#waiting').show()
}

function waiting_close() {
    $('#waiting').hide()
}

export function MeteorWrapper(...args) {
    return new Promise((resolve, reject) => {
        waiting()
        let f = args.pop()
        Meteor.call(...args, function (err, data) {
            waiting_close()
            if (typeof f === 'function') {
                f(err, data)
            }
            resolve()
        })
    })
}

export function MeteorLoginWithPassword(login, password) {
    waiting()
    Meteor.loginWithPassword(login, password, function (error) {
        waiting_close()
        if (error) {
            //console.log(error);
            FlashMessages.sendError("Неверные логин или пароль");
        } else {
            //Meteor.subscribe('clientsData');
            FlowRouter.go('/');
        }
    });
}