let empPayrollList;
window.addEventListener('DOMContentLoaded', (event) => {
    empPayrollList = getEmployeePayrollDataFromStorage();
    document.querySelector(".emp-count").textContent = empPayrollList.length;
    createInnerHtml();
    localStorage.removeItem('editEmp');
});

const getEmployeePayrollDataFromStorage = () => {
    return localStorage.getItem('EmployeePayrollList') ?
                JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
}

const createInnerHtml = () => {
    if (empPayrollList.length == 0) return;
    const headerHtml = "<th></th><th>Name</th><th>Gender</th>" +
                    "<th>Department</th><th>Salary</th><th>Start Date</th>" +
                    "<th>Actions</th>";
    let innerHtml = `${headerHtml}`;
    //let empPayrollList = createEmployeePayrollJSON();  
    for ( const empPayrollData of empPayrollList ) {
        innerHtml = `${innerHtml}
        <tr>
            <td>
                <img class="profile" alt="" src="${empPayrollData._profilePic}">
            </td>
            <td>${empPayrollData._name}</td>
            <td>${empPayrollData._gender}</td>
            <td>
                ${getDeptHtml(empPayrollData._department)}
            </td>
            <td>${empPayrollData._salary}</td>
            <td>${stringifyDate(empPayrollData._start_date)}</td>
            <td>
                <img id="${empPayrollData._id}" onclick="remove(this)" 
                            src="../assets/icons/delete-black-18dp.svg" alt="delete">
                <img id="${empPayrollData._id}" onclick="update(this)" 
                            src="../assets/icons/create-black-18dp.svg" alt="edit">           
            </td>
        </tr>
        `;
    }
    document.querySelector("#display").innerHTML = innerHtml;
};

const getDeptHtml = (deptList) => {
    let deptHtml = '';
    for ( const dept of deptList ) {
        deptHtml = `${deptHtml} <div class="dept-label">${dept}</div>`
    }
    return deptHtml;
}

const createEmployeePayrollJSON = () => {
    let empPayrollListLocal = [
        {
            _name: 'Sayani Koley',
            _gender: 'Female',
            _department: [
                'Engineering', 'HR'
            ],
            _salary: '250000',
            _start_date: '01 Nov 2020',
            _note: '',
            _profilePic: '../assets/profile-images/Ellipse 1.png'
        },
        {
            _name: 'Suvadeep Das',
            _gender: 'Male',
            _department: [
                'Engineering', 'Finance'
            ],
            _salary: '500000',
            _start_date: '29 Oct 2019',
            _note: '',
            _profilePic: '../assets/profile-images/Ellipse -3.png'
        }
    ]
    return empPayrollListLocal;
}

const remove = (node) => {
    let empPayrollData = empPayrollList.find(empData => empData._id == node.id);
    if( !empPayrollData ) return;
    const index = empPayrollList
                    .map( empData => empData._id )
                    .indexOf(empPayrollData._id);
    empPayrollList.splice(index, 1);
    localStorage.setItem("EmployeePyrollList", JSON.stringify(empPayrollList));
    document.querySelector(".emp-count").textContent = empPayrollList.length;
    createInnerHtml();
}

const update = (node) => {
    let empPayrollData = empPayrollList.find((empData) => empData._id == node.id);
    if (!empPayrollData) return;
    localStorage.setItem("editEmp", JSON.stringify(empPayrollData));
    window.location.replace(site_properties.add_emp_payroll_page);
}