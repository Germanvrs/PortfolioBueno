function addToSchedule() {
    var task = document.getElementById('task').value;
    var date = document.getElementById('date').value;
    var time = document.getElementById('time').value;

    if (task && date && time) {
        var table = document.getElementById('scheduleTable').getElementsByTagName('tbody')[0];
        var newRow = table.insertRow();

        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);

        cell1.textContent = task;
        cell2.textContent = date;
        cell3.textContent = time;

        document.getElementById('scheduleForm').reset();
    }
}
