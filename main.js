import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var'
import { MeteorWrapper } from './utils'

import './main.html';
import { saveAs } from 'file-saver';

const XLSX = require("xlsx");

var clientsList = new ReactiveVar([{
  ID: '1',
  SURNAME: 'TestSurname',
  NAME: 'TestName'
}])

Template.clients.onCreated(function onCreated() {
  //
});

Template.clients.helpers({
  ClientsList() {
    return clientsList.get();
  },
});

Template.clients.events({
  'click #getData'(event, instance) {
    MeteorWrapper('getClients', function (err, data) {
      if (data.success) {
        clientsList.set(data.data)
      } else {
        console.log(data.error)
        FlashMessages.sendError('Ошибка работы с БД');
      }
    })
  },
  'click #saveData'(event, instance) {
    var wb = XLSX.utils.book_new();
    wb.Props = {
      Title: "test1",
      Subject: "test1",
      Author: "test1",
      CreatedDate: new Date(),
    };
    wb.SheetNames.push("Sheet");
    let data = [];
    data.push(["Заголовок"]);
    let clientsListArray = clientsList.get()
    for(let i=0; i<clientsListArray.length; i++) {
      data.push([clientsListArray[i].ID, clientsListArray[i].SURNAME, clientsListArray[i].NAME])
    }

    var ws = XLSX.utils.aoa_to_sheet(data);
    wb.Sheets["Sheet"] = ws;
    var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
      var view = new Uint8Array(buf); //create uint8array as viewer
      for (var i = 0; i < s.length; i++)
        view[i] = s.charCodeAt(i) & 0xff; //convert to octet
      return buf;
    }
    saveAs(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      "test1.xlsx"
    );
  },
});
