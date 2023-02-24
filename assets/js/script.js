'use strict';

const patientInfoForm = document.getElementById('patientInfoForm');
const patientFormSubmitBtn = document.getElementById(
  'patientInfoFormSubmitBtn'
);
const reportEl = document.getElementById('report');
const patientDatalistEl = document.getElementById('patients');
const generateReportForOptBtn = document.getElementById(
  'generateReportForOptBtn'
);
const patientsDatalistForm = document.getElementById('patientsDatalistForm');
const resetLocalStorageAndForms = document.getElementById(
  'resetLocalStorageAndForms'
);

const patientsStore = localStorage.getItem('patients');
const patients = patientsStore ? JSON.parse(patientsStore) : [];

if (patients.length > 0) {
  patients.forEach(p => {
    const option = `<option value="${p.name}"></option>`;
    patientDatalistEl.insertAdjacentHTML('beforeend', option);
  });
}

function nursingReportGenerator(reportData) {
  const genderText = reportData.gender === 'مرد' ? 'آقای' : 'خانم';
  const bsChartText = reportData.bsChart ? 'و BS ' : '';
  const connections = reportData.connections
    ? `بیمار ${reportData.connections} دارد و فیکس و فانکشنال است.`
    : '';
  return `
  بیمار ${genderText} ${reportData.name} ${reportData.age} ساله با تشخیص ${reportData.diagnosis} تحت سرویس دکتر ${reportData.physician} در بخش غدد بستری است. بیمار هوشیار و بیدار و آگاه به مکان و زمان است. ارتباط چشمی و کلامی برقرار می‌کند. ${connections} تنفس خود به خودی دارد. رژیم غذایی ${reportData.diet} دارد. بیمار در سطح مراقبتی Ⅲ قرار دارد. VS ${bsChartText}بررسی و چارت شد. دیورز برقرار است. بیمار یک نوبت اجابت مزاج داشته است. دستورات دارویی بدون عارضه انجام شد. بدساید دو طرف تخت بالا و فیکس است. هم پوشانی با ${reportData.cover} انجام شد.
  `;
}

function printReport(report) {
  reportEl.textContent = report;
  window.print();
}

patientsDatalistForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const form = e.target;
  const input = form.patient.value;
  const targetPatient = patients.find(p => {
    return p.name === input;
  });

  if (targetPatient) {
    const infoForm = patientInfoForm;
    infoForm.name.value = targetPatient.name;
    infoForm.age.value = targetPatient.age;
    infoForm.gender.value = targetPatient.gender;
    infoForm.physician.value = targetPatient.physician;
    infoForm.diagnosis.value = targetPatient.diagnosis;
    infoForm.diet.value = targetPatient.diet;
    infoForm.activity.value = targetPatient.activity;
    infoForm.connections.value = targetPatient.connections;
    infoForm.cover.value = targetPatient.cover;
    infoForm.bsChart.checked = targetPatient.bsChart;
  }
});

patientInfoForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const form = e.target;
  console.dir(form);
  const name = form.name.value;
  const age = form.age.value;
  const gender = form.gender.value;
  const physician = form.physician.value;
  const diagnosis = form.diagnosis.value;
  const diet = form.diet.value;
  const activity = form.activity.value;
  const connections = form.connections.value;
  const cover = form.cover.value;
  const bsChart = form.bsChart.checked;

  const patientsStore = localStorage.getItem('patients');
  const patients = patientsStore ? JSON.parse(patientsStore) : [];

  console.log(patientsStore);
  console.log(patients);

  const reportData = {
    name,
    age,
    gender,
    physician,
    diagnosis,
    diet,
    activity,
    connections,
    cover,
    bsChart,
  };

  const existingPatient = patients.find(p => {
    return p.name === reportData.name;
  });

  if (!existingPatient) patients.push(reportData);

  console.log(reportData);

  localStorage.setItem('patients', JSON.stringify(patients));

  e.target.reset();

  const report = nursingReportGenerator(reportData);
  printReport(report);
});

resetLocalStorageAndForms.addEventListener('click', function (e) {
  const confirmMsg = 'آیا از حذف تاریخچه اطمینان دارید؟';
  if (confirm(confirmMsg)) {
    e.preventDefault();
    localStorage.clear();
    patientInfoForm.reset();
    patientsDatalistForm.reset();
    alert('تاریخچه با موفقیت حذف گردید');
  }
});
