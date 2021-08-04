/**
 * Convert Employee Payroll App to Client Server Architecture.
    Stage 5: Ability to remove Employee from Payroll Service.
    
    @author : SAYANI KOLEY
    @since : 04.08.2021
 */

let empPayrollList;
window.addEventListener('DOMContentLoaded', (event) => {
    if ( site_properties.use_local_storrage.match("true") ) {
        getEmployeePayrollDataFromStorage();
    } else getEmployeePayrollDataFromServer();
});

const getEmployeePayrollDataFromStorage = () => {
    empPayrollList = localStorage.getItem('EmployeePayrollList') ?
                    JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
    processEmployeePayrollDataResponse();
}

const processEmployeePayrollDataResponse = () => {
    document.querySelector(".emp-count").textContent = empPayrollList.length;
    createInnerHtml();
    localStorage.removeItem('editEmp');
}

const getEmployeePayrollDataFromServer = () => {
    makeServiceCall("GET", site_properties.server_url, true)
        .then(responseText => {
            empPayrollList = JSON.parse(responseText);
            processEmployeePayrollDataResponse();
        })
        .catch(error => {
            console.log("GET Error Status: "+JSON.stringify(error));
            empPayrollList = [];
            processEmployeePayrollDataResponse();
        });
}

const createInnerHtml = () => {
    if (empPayrollList.length == 0) return;
    const headerHtml = "<th></th><th>Name</th><th>Gender</th>" +
                    "<th>Department</th><th>Salary</th><th>Start Date</th>" +
                    "<th>Actions</th>";
    let innerHtml = `${headerHtml}`;
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
                <img id="${empPayrollData.id}" onclick="remove(this)" 
                            src="../assets/icons/delete-black-18dp.svg" alt="delete">
                <img id="${empPayrollData.id}" onclick="update(this)" 
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

const remove = (node) => {
    let empPayrollData = empPayrollList.find(empData => empData.id == node.id);
    if( !empPayrollData ) return;
    const index = empPayrollList
                    .map( empData => empData.id )
                    .indexOf(empPayrollData.id);
    empPayrollList.splice(index, 1);
    if ( site_properties.use_local_storrage.match("true") ) {
        localStorage.setItem("EmployeePyrollList", JSON.stringify(empPayrollList));
        createInnerHtml();
     } else {
        const deleteURL = site_properties.server_url + empPayrollData.id.toString();
        makeServiceCall("DELETE", deleteURL, false)
            .then(responseText => {
                createInnerHtml();
        })
        .catch(error => {
            console.log("DELETE Error Status: "+JSON.stringify(error));
      });
    }
}

const update = (node) => {
    let empPayrollData = empPayrollList.find((empData) => empData.id == node.id);
    if (!empPayrollData) return;
    localStorage.setItem("editEmp", JSON.stringify(empPayrollData));
    window.location.replace(site_properties.add_emp_payroll_page);
}