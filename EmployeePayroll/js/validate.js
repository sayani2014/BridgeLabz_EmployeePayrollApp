var isUpdate = false;
let employeePayrollObj = {};

window.addEventListener('DOMContentLoaded', (event) => {
   const name = document.querySelector('#name');
   name.addEventListener('input', function() {
      if ( name.value.length == 0) {
         setTextValue('.text-error',"");
         return;
      }
      try {
         checkName(name.value);
         setTextValue('.text-error',"");
      } catch (e) {
         setTextValue('.text-error', e);
      }
   });

   const date = document.querySelector('#date');
   date.addEventListener('input', function() {
      const startDate = getInputValueById('#day') + " " +
                              getInputValueById('#month') + " " +
                                    getInputValueById('#year');
      try {
         checkStartDate(new Date(Date.parse(startDate)));
         setTextValue('.date-error', "");
      } catch (e) {
         setTextValue('.date-error', e);
      }
   });

   const salary = document.querySelector('#salary');
   setTextValue('.salary-output', salary.value);
   salary.addEventListener('input', function() {
      setTextValue('.salary-output', salary.value);
   });

   checkForUpdate();
});

const save = (event) => {
   event.preventDefault();
   event.stopPropagation();
   try {
      setEmployeePayrollObject();
      if ( site_properties.use_local_storrage.match("true") ) {
         createAndUpdateStorage();
         resetForm();
         window.location.replace(site-properties.home_page);
      } else {
         createOrUpdateEmployeePayroll();
      }
   } catch (e) {
      return;
   }
};

const createOrUpdateEmployeePayroll = () => {
   let postURL = site_properties.server_url;
   let methodCall = "POST";
   if(isUpdate) {
      methodCall = "PUT";
      postURL = postURL + employeePayrollObj.id.toString();
   }
   makeServiceCall(methodCall, postURL, true, employeePayrollObj)
      .then(responseText => {
         resetForm();
         window.location.replace(site_properties.home_page);
      })
      .catch(error => {
         throw error;
      });
}

const setEmployeePayrollObject = () => {
   if(!isUpdate) employeePayrollObj.id = createNewEmployeeId();
   employeePayrollObj._name = getInputValueById('#name');
   employeePayrollObj._profilePic = getSelectedValues('[name=profile]').pop();
   employeePayrollObj._gender = getSelectedValues('[name=gender]').pop();
   employeePayrollObj._department = getSelectedValues('[name=department]');
   employeePayrollObj._salary = getInputValueById('#salary');
   employeePayrollObj._note = getInputValueById('#notes');
   let date = getInputValueById('#day') + " " +getInputValueById('#month') + " "
                                                      +getInputValueById('#year');
   employeePayrollData._start_date = date;
}

const getSelectedValues = (propertyValue) => {
   let allItems = document.querySelectorAll(propertyValue);
   let selItems = [];
   allItems.forEach ( item => {
      if( item.checked )
         selItems.push( item.value );
   });
   return selItems;
}

const getInputValueById = ( id ) => {
   let value = document.querySelector(id).value;
   return value;
}

const createAndUpdateStorage = () => {
  // localStorage.clear();
   let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
   if(employeePayrollList) {
      let empPayrollData = employeePayrollList
                                 .find(empData => empData.id == employeePayrollObj.id);
      if (!empPayrollData) {
         employeePayrollList.push(employeePayrollObj);
      } else {
         const index = employeePayrollList
                        .map( empData => empData.id)
                        .indexOf(employeePayrollData.id);
         employeePayrollList.splice(index, 1, employeePayrollObj);
      }
   } else {
      employeePayrollList = [employeePayrollObj];
   }
   localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
}

const createEmployeePayrollData = (id) => {
   let employeePayrollData = new PersonInfo();
   if(!id) employeePayrollData.id = createNewEmployeeId();
   else employeePayrollData.id = id;
   setEmployeePayrollData(employeePayrollData);
   return employeePayrollData;
}

const setEmployeePayrollData = (employeePayrollData) => {
   try {
      employeePayrollData.name = employeePayrollObj._name;
   } catch (e) {
      setTextValue('.text-error', e);
      throw e;
   }

   employeePayrollData.profilePic = employeePayrollObj._profilePic;
   employeePayrollData.gender = employeePayrollObj._gender;
   employeePayrollData.department = employeePayrollObj._department;
   employeePayrollData.salary = employeePayrollObj._salary;
   employeePayrollData.note = employeePayrollObj._salary;
   try {
      employeePayrollData.startDate = 
                  new Date(Date.parse(employeePayrollObj._start_date));
   } catch (e) {
      setTextValue('.date-error', e);
      throw e;
   }
   alert(employeePayrollData.toString());
}

const createNewEmployeeId = () => {
   let empID = localStorage.getItem("EmployeeID");
   empID = !empID ? 1 : (parseInt(empID)+1).toString();
   localStorage.setItem("EmployeeID", empID);
   return empID;
}

// const getSelectedValues = (propertyValue) => {
//    let allItems = document.querySelectorAll(propertyValue);
//    let selItems = [];
//    allItems.forEach(item => {
//       if(item.checked) selItems.push(item.value);
//    });
//    return selItems;
// }

const resetForm = () => {
   setValue('#name','');
   unsetSelectedValues('[name=profile]');
   unsetSelectedValues('[name=gender]');
   unsetSelectedValues('[name=department]');
   setValue('#salary','');
   setValue('#notes','');
   setValue('#day','Day');
   setValue('#month','Month');
   setValue('#year','Year');
};

const unsetSelectedValues = (propertyValue) => {
   let allItems = document.querySelectorAll(propertyValue);
   allItems.forEach(item => {
      item.checked = false;
   });
}

const setTextValue = (id, value) => {
   const element = document.querySelector(id);
   element.textContent = value;
}

const setValue = (id, value) => {
   const element = document.querySelector(id);
   element.value = value;
}

const checkForUpdate = () => {
   const employeePayrollJson = localStorage.getItem('editEmp');
   isUpdate = employeePayrollJson ? true : false;
   if(!isUpdate)
      return;
   employeePayrollObj = JSON.parse(employeePayrollJson);
   setForm();
};

const setForm = () => {
   setValue('#name', employeePayrollObj._name);
   setSelectedValues('[name=profile]', employeePayrollObj._profilePic);
   setSelectedValues("[name=gender]", employeePayrollObj._gender);
    setSelectedValues("[name=department]", employeePayrollObj._department);
    setValue("#salary", employeePayrollObj._salary);
    setTextValue(".salary-output", employeePayrollObj._salary);
    setValue("#notes", employeePayrollObj._note);
    let date = stringifyDate(employeePayrollObj._start_date).split(" ");
    setValue("#day", date[0]);
    setValue("#month", date[1]);
    setValue("#year", date[2]);
};

const setSelectedValues = (propertyValue, value) => {
   let allItems = document.querySelectorAll(propertyValue);
   allItems.forEach((item) => {
       if (Array.isArray(value)) {
           if (value.includes(item.value)) {
               item.checked = true;
           }
       }
       else if (item.value === value) 
         item.checked = true;
   });
};





