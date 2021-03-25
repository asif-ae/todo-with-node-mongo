const loadAllJobs = () => {
  fetch('/jobs')
  .then(res => res.json())
  .then(data => {
    console.log(data);
    const conatainer = document.getElementById('job-list');

    // For finalizing
    conatainer.innerHTML = '';

    data.forEach(job => {
      console.log(job._id);
      const item = document.createElement('div');
      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.justifyContent = "space-around";

      item.innerHTML = `
        <h4>${job.jobName}</h4>
        <p class="m-0">${job.jobDescription}</p>
        <button class="btn btn-primary" onclick="loadProduct('${job._id}')">Update</button>
        <button class="btn btn-primary" onclick="deleteProduct(event, '${job._id}')">Delete</button>
      `;
      conatainer.appendChild(item);
    });
  });
}

loadAllJobs();

// Delete Product Function
const deleteProduct = (event, id) => {
  fetch(`/delete/${id}`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(result => {
    if (result) {
      event.target.parentNode.style.display = "none";
    }
  });
}

// Load Product Function
const loadProduct = (id) => {
  fetch(`/job/${id}`)
  .then(res => res.json())
  .then(data => {
    const update = document.getElementById('job-update');
    update.innerHTML = `
      <h4 class="text-center mt-5">Update</h4>
      <div class="row p-3 g-2">
        <div class="col-md-5">
          <div class="mb-3">
            <input type="text" class="form-control" id="updateJobName" name="updateJobName" placeholder="Update Job Name" value="${data.jobName}">
          </div>
        </div>
        <div class="col-md-5">
          <div class="mb-3">
            <input type="text" class="form-control" id="updateJobDescription" name="updateJobDescription" placeholder="Update Job Description" value="${data.jobDescription}">
          </div>
        </div>
        <div class="col-md-2">
          <div class="mb-3">
            <input type="submit" class="btn btn-primary w-100 form-control" value="Submit" onclick="updateProduct('${data._id}')">
          </div>
        </div>
      </div>
    `;
  });
}

// Update Product Function
const updateProduct = (id) => {
  const jobName = document.getElementById('updateJobName').value;
  const jobDescription = document.getElementById('updateJobDescription').value;
  const job = {id, jobName, jobDescription};
  console.log(job);
  fetch(`/update/${id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(job)
  })
  .then(res => res.json())
  .then(result => {
    if (result) {
      loadAllJobs();
      document.getElementById('job-update').innerHTML = '';
    }
  });
}