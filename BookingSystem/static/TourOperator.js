

console.log('TourOperator.js loaded successfully!');

// Ensure everything runs after DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded.');

    // Sidebar Tab Switching Logic
    const navLinks = document.querySelectorAll('.nav-link');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabPanes.forEach((pane) => pane.classList.remove('active'));
    const activeTab = document.querySelector('.nav-link.active');
    if (activeTab) {
        document.getElementById(activeTab.dataset.tab).classList.add('active');
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach((link) => link.classList.remove('active'));
            tabPanes.forEach((pane) => pane.classList.remove('active'));

            link.classList.add('active');
            document.getElementById(link.dataset.tab).classList.add('active');
        });
    });

    // Logout Modal Logic
    const logoutModal = document.getElementById('logout-modal');
    const confirmLogout = document.getElementById('confirm-logout');
    const cancelLogout = document.getElementById('cancel-logout');

    const logoutTab = document.querySelector('[data-tab="logout"]');
    if (logoutTab) {
        logoutTab.addEventListener('click', () => {
            logoutModal.classList.add('show');
        });
    }
    confirmLogout?.addEventListener('click', () => {
        window.location.href = '{{ url_for("touroperator.logout") }}';
    });

    cancelLogout?.addEventListener('click', () => {
        logoutModal.classList.remove('show');
    });





    // Booking Tab Switching Logic
    const bookingTabBtns = document.querySelectorAll('.booking-tab-btn');
    const bookingCategories = document.querySelectorAll('.booking-category');

    bookingTabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            bookingTabBtns.forEach((btn) => btn.classList.remove('active'));
            btn.classList.add('active');

            const status = btn.dataset.status;
            bookingCategories.forEach((category) => {
                const categoryStatus = category.dataset.status;
                category.style.display =
                    status === 'all' || categoryStatus === status ? 'block' : 'none';
            });
        });
    });




// Booking Details Modal Logic
const bookingModal = document.getElementById('booking-modal');
const bookingInfo = document.getElementById('booking-info');
const closeBookingModal = document.getElementById('close-booking-modal');

function openBookingDetails(details) {
  bookingInfo.textContent = details;
  bookingModal.classList.add('show');
}

closeBookingModal.addEventListener('click', () => {
  bookingModal.classList.remove('show');
});


    // Profile Picture Upload and Cropper Logic
    const changePicBtn = document.getElementById('change-pic-btn');
    const uploadPicInput = document.getElementById('upload-pic');
    const profilePic = document.getElementById('profile-pic');
    const cropperModal = document.getElementById('cropper-modal');
    const cropperContainer = document.getElementById('cropper-container');
    const cropBtn = document.getElementById('crop-btn');
    const closeCropperModal = document.getElementById('close-cropper-modal');
    const savePicBtn = document.getElementById('save-pic-btn');
    let cropper = null;

    changePicBtn?.addEventListener('click', () => uploadPicInput.click());

    uploadPicInput?.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.id = 'crop-image';
                cropperContainer.innerHTML = '';
                cropperContainer.appendChild(img);

                cropperModal.classList.add('show');
                cropper = new Cropper(img, { aspectRatio: 1, viewMode: 1 });
            };
            reader.readAsDataURL(file);
        }
    });

    cropBtn?.addEventListener('click', () => {
        if (cropper) {
            const canvas = cropper.getCroppedCanvas({ width: 200, height: 200 });
            profilePic.src = canvas.toDataURL();
            cropperModal.classList.remove('show');
            savePicBtn.classList.remove('hidden');
        }
    });

    savePicBtn?.addEventListener('click', () => {
        alert('Profile picture saved!');
        savePicBtn.classList.add('hidden');
    });

    closeCropperModal?.addEventListener('click', () => {
        cropperModal.classList.remove('show');
    });




    

    // Editable Fields Logic
    setupEditableSection('name');
    setupEditableSection('municipal');
    setupEditableSection('email');
    setupEditableSection('contact-number');

    function setupEditableSection(fieldId) {
        const editBtn = document.getElementById(`edit-${fieldId}-btn`);
        const saveBtn = document.getElementById(`save-${fieldId}-btn`);
        const input = document.getElementById(fieldId);

        editBtn?.addEventListener('click', () => {
            input.disabled = false;
            input.focus();
            editBtn.classList.add('hidden');
            saveBtn.classList.remove('hidden');
        });

        saveBtn?.addEventListener('click', () => {
            input.disabled = true;
            editBtn.classList.remove('hidden');
            saveBtn.classList.add('hidden');
        });
    }

    

    // Password Management Logic
    const editPasswordBtn = document.getElementById('edit-password-btn');
    const savePasswordBtn = document.getElementById('save-password-btn');
    const reenterPasswordGroup = document.getElementById('reenter-password-group');
    const newPasswordGroup = document.getElementById('new-password-group');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');

    editPasswordBtn?.addEventListener('click', () => togglePasswordEdit(true));
    savePasswordBtn?.addEventListener('click', () => togglePasswordEdit(false));

    function togglePasswordEdit(isEditing) {
        [reenterPasswordGroup, newPasswordGroup, confirmPasswordGroup].forEach(group => {
            group.classList.toggle('hidden', !isEditing);
        });
        editPasswordBtn.classList.toggle('hidden', isEditing);
        savePasswordBtn.classList.toggle('hidden', !isEditing);
    }
});








  // Add Tour Guide Modal Logic
  const addTourGuideBtn = document.getElementById('add-tour-guide-btn');
  const tourGuideModal = document.getElementById('tour-guide-modal');
  const closeTourGuideModal = document.getElementById('close-tour-guide-modal');

  addTourGuideBtn?.addEventListener('click', () => {
    tourGuideModal.classList.add('show');
  });

  closeTourGuideModal?.addEventListener('click', () => {
    tourGuideModal.classList.remove('show');
  });



//   document.addEventListener('DOMContentLoaded', function () {
//     // ** Open "Add Package" modal **
//     document.getElementById('open-form-btn').addEventListener('click', () => {
//       document.getElementById('form-modal').classList.add('show');
//       document.getElementById('modal-overlay').classList.add('show');
//     });
  
//     // ** Close "Add Package" modal **
//     document.getElementById('close-form-modal').addEventListener('click', () => {
//       document.getElementById('form-modal').classList.remove('show');
//       document.getElementById('modal-overlay').classList.remove('show');
//     });
  
//     // ** Open "View Package" modal **
//     document.querySelectorAll('.view-package').forEach(button => {
//       button.addEventListener('click', async function () {
//         const packageId = this.getAttribute('data-package-id'); // Get package ID
  
//         try {
//           // Fetch package details from server
//           const response = await fetch(`/touroperator/get_tour_package/${packageId}`);
//           if (!response.ok) {
//             throw new Error("Network response was not ok");
//           }
//           const data = await response.json();
  
//           // Populate modal content
//           const modal = document.getElementById('tour-details-modal');
//           // modal.querySelector('.modal-header-image').src = data.package_img
//           //   ? `/static/package_pics/${data.package_img}`
//           //   : '/static/default.jpg';

//           // // Populate modal header image
//           // const modal = document.getElementById('tour-details-modal');
//           // document.querySelector('.modal-header-image').src = data.package_img
//           // ? `/static/${data.package_img}` // Use the relative path stored in the database
//           // : '/static/default.jpg'; // Fallback image


//           modal.querySelector('.modal-title').textContent = data.name || 'Unnamed Package';
//           modal.querySelector('.description').textContent = data.description || 'No description provided';
  
//           // Populate estimated prices
//           const priceList = modal.querySelector('.price-list');
//           priceList.innerHTML = '';
//           data.estimated_prices.forEach(price => {
//             const priceItem = document.createElement('li');
//             priceItem.textContent = `${price.description}: ₱${price.estimated_price}`;
//             priceList.appendChild(priceItem);
//           });
  
//           // Populate inclusions
//           const inclusionsList = modal.querySelector('.inclusions-list');
//           inclusionsList.innerHTML = '';
//           data.inclusions.forEach(inclusion => {
//             const inclusionItem = document.createElement('li');
//             inclusionItem.innerHTML = `<span class="checkmark">&#10003;</span> ${inclusion.inclusion}`;
//             inclusionsList.appendChild(inclusionItem);
//           });
  
//           // Populate exclusions
//           const exclusionsList = modal.querySelector('.exclusions-list');
//           exclusionsList.innerHTML = '';
//           data.exclusions.forEach(exclusion => {
//             const exclusionItem = document.createElement('li');
//             exclusionItem.innerHTML = `<span class="crossmark">&#10007;</span> ${exclusion.exclusion}`;
//             exclusionsList.appendChild(exclusionItem);
//           });
  
//           // Populate itinerary
//           const itineraryList = modal.querySelector('.itinerary-list');
//           itineraryList.innerHTML = '';
//           data.itineraries.forEach(item => {
//             const itineraryItem = document.createElement('li');
//             itineraryItem.innerHTML = `
//               <span class="timeline-dot"></span>
//               <div class="timeline-content"><strong>${item.title}:</strong> ${item.subtitle}</div>`;
//             itineraryList.appendChild(itineraryItem);
//           });
  
//           // Add functionality to "Edit" and "Delete" buttons
//           const editButton = modal.querySelector('#edit-package');
//           const deleteButton = modal.querySelector('#delete-package');
  
//           editButton.onclick = () => {
//             openEditForm(data); // Call a function to populate the edit form
//           };
  
//           deleteButton.onclick = async () => {
//             const confirmDelete = confirm(`Are you sure you want to delete the package "${data.name}"?`);
//             if (confirmDelete) {
//               try {
//                 const deleteResponse = await fetch(`/touroperator/delete_tour_package/${packageId}`, { method: 'DELETE' });
//                 if (deleteResponse.ok) {
//                   alert('Package deleted successfully.');
//                   document.getElementById(`package-card-${packageId}`).remove(); // Remove card from UI
//                   closeModal();
//                 } else {
//                   alert('Failed to delete the package. Please try again.');
//                 }
//               } catch (err) {
//                 console.error('Error deleting package:', err);
//                 alert('An error occurred while deleting the package.');
//               }
//             }
//           };


  
//           // Show the modal
//           modal.classList.add('show');
//           document.getElementById('modal-overlay').classList.add('show');
//         } catch (error) {
//           console.error("Failed to load package details:", error);
//           alert('Could not load package details. Please try again.');
//         }
//       });
//     });
  
//     // Close modal when the close buttons or overlay are clicked
//     const closeModal = () => {
//       document.getElementById('tour-details-modal').classList.remove('show');
//       document.getElementById('modal-overlay').classList.remove('show');
//     };
//     document.getElementById('close-modal').addEventListener('click', closeModal);
//     document.getElementById('modal-overlay').addEventListener('click', closeModal);
  
//     // Open edit form and populate data
//     const openEditForm = (data) => {
//       const formModal = document.getElementById('form-modal');
//       formModal.classList.add('show');
//       document.getElementById('modal-overlay').classList.add('show');
  
//       // Populate form fields
//       document.getElementById('package-name').value = data.name || '';
//       document.getElementById('description').value = data.description || '';
  
//       // Handle file input (leave empty for user to upload a new file)
//       document.getElementById('image-upload').value = '';
  
//       // Populate inclusions
//       const inclusionsList = document.getElementById('inclusions-list');
//       inclusionsList.innerHTML = '';
//       data.inclusions.forEach(inclusion => {
//         const inclusionItem = document.createElement('li');
//         inclusionItem.innerHTML = `
//           <input type="text" name="inclusions[]" value="${inclusion.inclusion}" class="editable-item" />
//           <button type="button" class="remove-btn">Remove</button>`;
//         inclusionsList.appendChild(inclusionItem);
//       });
  
//       // Populate exclusions
//       const exclusionsList = document.getElementById('exclusions-list');
//       exclusionsList.innerHTML = '';
//       data.exclusions.forEach(exclusion => {
//         const exclusionItem = document.createElement('li');
//         exclusionItem.innerHTML = `
//           <input type="text" name="exclusions[]" value="${exclusion.exclusion}" class="editable-item" />
//           <button type="button" class="remove-btn">Remove</button>`;
//         exclusionsList.appendChild(exclusionItem);
//       });
  
//       // Populate itinerary
//       const itineraryList = document.getElementById('itinerary-list');
//       itineraryList.innerHTML = '';
//       data.itineraries.forEach(item => {
//         const itineraryItem = document.createElement('li');
//         itineraryItem.innerHTML = `
//           <input type="text" name="itinerary_title[]" value="${item.title}" class="editable-item" />
//           <input type="text" name="itinerary_subtitle[]" value="${item.subtitle}" class="editable-item" />
//           <button type="button" class="remove-btn">Remove</button>`;
//         itineraryList.appendChild(itineraryItem);
//       });
//     };



//     document.addEventListener('DOMContentLoaded', function () {
//       // Open "Create/Edit Package" modal
//       document.getElementById('open-form-btn').addEventListener('click', () => {
//           openModal('form-modal');
//       });
  
//       // Close "Create/Edit Package" modal
//       document.getElementById('close-form-modal').addEventListener('click', () => {
//           closeModal('form-modal');
//       });
  
//       // Add functionality for dynamic inclusions, exclusions, itinerary, and estimated prices
//       addDynamicFields('add-estimated-price-btn', 'estimated-price-list', [
//           '<input type="text" name="estimated_price_description[]" placeholder="Description" class="editable-item" />',
//           '<input type="text" name="estimated_price_value[]" placeholder="Price" class="editable-item" />',
//           '<button type="button" class="remove-btn">Remove</button>'
//       ]);
  
//       addDynamicFields('add-inclusion-btn', 'inclusions-list', [
//           '<input type="text" name="inclusions[]" placeholder="Add inclusion" class="editable-item" />',
//           '<button type="button" class="remove-btn">Remove</button>'
//       ]);
  
//       addDynamicFields('add-exclusion-btn', 'exclusions-list', [
//           '<input type="text" name="exclusions[]" placeholder="Add exclusion" class="editable-item" />',
//           '<button type="button" class="remove-btn">Remove</button>'
//       ]);
  
//       addDynamicFields('add-itinerary-btn', 'itinerary-list', [
//           '<input type="text" name="itinerary_title[]" placeholder="Title" class="editable-item" />',
//           '<input type="text" name="itinerary_subtitle[]" placeholder="Subtitle" class="editable-item" />',
//           '<button type="button" class="remove-btn">Remove</button>'
//       ]);
  
//       // Remove dynamic fields
//       document.addEventListener('click', function (e) {
//           if (e.target && e.target.classList.contains('remove-btn')) {
//               e.target.parentElement.remove();
//           }
//       });
//   });
  
//   /**
//    * Add dynamic fields to a list.
//    * @param {String} buttonId - The ID of the "Add" button.
//    * @param {String} listId - The ID of the list to append items to.
//    * @param {Array} fieldHtml - The HTML for the new fields.
//    */
//   function addDynamicFields(buttonId, listId, fieldHtml) {
//       document.getElementById(buttonId).addEventListener('click', function () {
//           const list = document.getElementById(listId);
//           const newItem = document.createElement('li');
//           newItem.innerHTML = fieldHtml.join('');
//           list.appendChild(newItem);
//       });
//   }
// })

  

//   document.addEventListener('DOMContentLoaded', function () {
//     // ** Open "View Package" modal **
//     document.querySelectorAll('.view-package').forEach(button => {
//         button.addEventListener('click', async function () {
//             const packageId = this.getAttribute('data-package-id'); // Get package ID

//             try {
//                 await populateViewPackageModal(packageId); // Populate modal content
//                 openModal('tour-details-modal'); // Open the modal
//             } catch (error) {
//                 console.error("Failed to load package details:", error);
//                 alert('Could not load package details. Please try again.');
//             }
//         });
//     });

//     // Close the View Package Modal
//     document.getElementById('close-modal').addEventListener('click', () => {
//         closeModal('tour-details-modal');
//     });document.addEventListener('DOMContentLoaded', function () {
//       // ** Open "View Package" modal **
//       document.querySelectorAll('.view-package').forEach(button => {
//           button.addEventListener('click', async function () {
//               const packageId = this.getAttribute('data-package-id'); // Get package ID
  
//               try {
//                   await populateViewPackageModal(packageId); // Populate modal content
//                   openModal('tour-details-modal'); // Open the modal
//               } catch (error) {
//                   console.error("Failed to load package details:", error);
//                   alert('Could not load package details. Please try again.');
//               }
//           });
//       });
  
//       // Close the View Package Modal
//       document.getElementById('close-modal').addEventListener('click', () => {
//           closeModal('tour-details-modal');
//       });
  
//       document.getElementById('modal-overlay').addEventListener('click', () => {
//           closeModal('tour-details-modal');
//       });
//   });
  
//   /**
//    * Populate "View Package" modal with package details.
//    * @param {Number} packageId - The ID of the package to fetch and display.
//    */
//   async function populateViewPackageModal(packageId) {
//       const response = await fetch(`/touroperator/get_tour_package/${packageId}`);
//       if (!response.ok) throw new Error("Failed to fetch package details");
  
//       const data = await response.json();
  
//       const modal = document.getElementById('tour-details-modal');
//       modal.querySelector('.modal-header-image').src = data.package_img
//           ? `/static/${data.package_img}` // Ensure correct image path
//           : '/static/default.jpg';
//       modal.querySelector('.modal-title').textContent = data.name || 'Unnamed Package';
//       modal.querySelector('.description').textContent = data.description || 'No description provided';
  
//       // Populate estimated prices
//       const priceList = modal.querySelector('.price-list');
//       priceList.innerHTML = '';
//       data.estimated_prices.forEach(price => {
//           const priceItem = document.createElement('li');
//           priceItem.textContent = `${price.description}: ₱${price.estimated_price}`;
//           priceList.appendChild(priceItem);
//       });
  
//       // Populate inclusions
//       const inclusionsList = modal.querySelector('.inclusions-list');
//       inclusionsList.innerHTML = '';
//       data.inclusions.forEach(inclusion => {
//           const inclusionItem = document.createElement('li');
//           inclusionItem.innerHTML = `<span class="checkmark">&#10003;</span> ${inclusion.inclusion}`;
//           inclusionsList.appendChild(inclusionItem);
//       });
  
//       // Populate exclusions
//       const exclusionsList = modal.querySelector('.exclusions-list');
//       exclusionsList.innerHTML = '';
//       data.exclusions.forEach(exclusion => {
//           const exclusionItem = document.createElement('li');
//           exclusionItem.innerHTML = `<span class="crossmark">&#10007;</span> ${exclusion.exclusion}`;
//           exclusionsList.appendChild(exclusionItem);
//       });
  
//       // Populate itinerary
//       const itineraryList = modal.querySelector('.itinerary-list');
//       itineraryList.innerHTML = '';
//       data.itineraries.forEach(item => {
//           const itineraryItem = document.createElement('li');
//           itineraryItem.innerHTML = `
//               <span class="timeline-dot"></span>
//               <div class="timeline-content"><strong>${item.title}:</strong> ${item.subtitle}</div>`;
//           itineraryList.appendChild(itineraryItem);
//       });
  
//       // Add functionality to "Edit" and "Delete" buttons
//       addEditFunctionality(data);
//       addDeleteFunctionality(packageId);
//   }
  
//   /**
//    * Add functionality to the "Edit" button.
//    * @param {Object} data - The package data to populate in the form.
//    */
//   function addEditFunctionality(data) {
//       const editButton = document.getElementById('edit-package');
//       editButton.onclick = () => {
//           openEditForm(data);
//       };
//   }
  
//   /**
//    * Add functionality to the "Delete" button.
//    * @param {Number} packageId - The ID of the package to delete.
//    */
//   function addDeleteFunctionality(packageId) {
//       const deleteButton = document.getElementById('delete-package');
//       deleteButton.onclick = async () => {
//           const confirmDelete = confirm(`Are you sure you want to delete the package?`);
//           if (confirmDelete) {
//               try {
//                   const deleteResponse = await fetch(`/touroperator/delete_tour_package/${packageId}`, { method: 'DELETE' });
//                   if (deleteResponse.ok) {
//                       alert('Package deleted successfully.');
//                       document.getElementById(`package-card-${packageId}`).remove(); // Remove card from UI
//                       closeModal('tour-details-modal');
//                   } else {
//                       alert('Failed to delete the package. Please try again.');
//                   }
//               } catch (err) {
//                   console.error('Error deleting package:', err);
//                   alert('An error occurred while deleting the package.');
//               }
//           }
//       };
//   }
  
//   /**
//    * Open the edit form and populate it with data.
//    * @param {Object} data - The package data to populate.
//    */
//   function openEditForm(data) {
//       const formModal = document.getElementById('form-modal');
//       formModal.classList.add('show');
//       document.getElementById('modal-overlay').classList.add('show');
  
//       // Populate form fields
//       document.getElementById('package-name').value = data.name || '';
//       document.getElementById('description').value = data.description || '';
  
//       // Handle file input (leave empty for user to upload a new file)
//       document.getElementById('image-upload').value = '';
  
//       // Populate inclusions
//       const inclusionsList = document.getElementById('inclusions-list');
//       inclusionsList.innerHTML = '';
//       data.inclusions.forEach(inclusion => {
//           const inclusionItem = document.createElement('li');
//           inclusionItem.innerHTML = `
//               <input type="text" name="inclusions[]" value="${inclusion.inclusion}" class="editable-item" />
//               <button type="button" class="remove-btn">Remove</button>`;
//           inclusionsList.appendChild(inclusionItem);
//       });
  
//       // Populate exclusions
//       const exclusionsList = document.getElementById('exclusions-list');
//       exclusionsList.innerHTML = '';
//       data.exclusions.forEach(exclusion => {
//           const exclusionItem = document.createElement('li');
//           exclusionItem.innerHTML = `
//               <input type="text" name="exclusions[]" value="${exclusion.exclusion}" class="editable-item" />
//               <button type="button" class="remove-btn">Remove</button>`;
//           exclusionsList.appendChild(exclusionItem);
//       });
  
//       // Populate itinerary
//       const itineraryList = document.getElementById('itinerary-list');
//       itineraryList.innerHTML = '';
//       data.itineraries.forEach(item => {
//           const itineraryItem = document.createElement('li');
//           itineraryItem.innerHTML = `
//               <input type="text" name="itinerary_title[]" value="${item.title}" class="editable-item" />
//               <input type="text" name="itinerary_subtitle[]" value="${item.subtitle}" class="editable-item" />
//               <button type="button" class="remove-btn">Remove</button>`;
//           itineraryList.appendChild(itineraryItem);
//       });
//   }
  
//   /**
//    * Open the modal.
//    * @param {String} modalId - The ID of the modal to open.
//    */
//   function openModal(modalId) {
//       document.getElementById(modalId).classList.add('show');
//       document.getElementById('modal-overlay').classList.add('show');
//   }
  
//   /**
//    * Close the modal.
//    * @param {String} modalId - The ID of the modal to close.
//    */
//   function closeModal(modalId) {
//       document.getElementById(modalId).classList.remove('show');
//       document.getElementById('modal-overlay').classList.remove('show');
//   }
// })
  



  // // Add and Remove Estimated Prices
  // document.addEventListener('DOMContentLoaded', () => {
  //   const addEstimatedPriceBtn = document.getElementById('add-estimated-price-btn');
    
  //   if (addEstimatedPriceBtn) {
  //     addEstimatedPriceBtn.addEventListener('click', () => {
  //       const newExpense = document.createElement('li');
  //       newExpense.innerHTML = `<input type="text" placeholder="Description" class="editable-item" />
  //                               <input type="text" placeholder="Price" class="editable-item" />
  //                               <button type="button" class="remove-btn">Remove</button>`;
  //       document.getElementById('estimated-price-list').appendChild(newExpense);
  //       updateNameAttributes('estimated-price-list', 'estimated_prices');
  //     });
  //   } else {
  //     console.error("Element with ID 'add-estimated-price-btn' not found in the DOM.");
  //   }
  // });
  

  // // Add and Remove Inclusions/Exclusions
  // document.getElementById('add-inclusion-btn').addEventListener('click', () => {
  //   const newInclusion = document.createElement('li');
  //   newInclusion.innerHTML = `<input type="text" placeholder="Add inclusion" class="editable-item" />
  //                             <button type="button" class="remove-btn">Remove</button>`;
  //   document.getElementById('inclusions-list').appendChild(newInclusion);
  //   updateNameAttributes('inclusions-list', 'inclusions');
  // });

  // document.getElementById('add-exclusion-btn').addEventListener('click', () => {
  //   const newExclusion = document.createElement('li');
  //   newExclusion.innerHTML = `<input type="text" placeholder="Add exclusion" class="editable-item" />
  //                             <button type="button" class="remove-btn">Remove</button>`;
  //   document.getElementById('exclusions-list').appendChild(newExclusion);
  //   updateNameAttributes('exclusions-list', 'exclusions');
  // });

  // // Add and Remove Itinerary Items
  // document.getElementById('add-itinerary-btn').addEventListener('click', () => {
  //   const newItinerary = document.createElement('li');
  //   newItinerary.innerHTML = `<input type="text" placeholder="Title" class="editable-item" />
  //                             <input type="text" placeholder="Subtitle" class="editable-item" />
  //                             <button type="button" class="remove-btn">Remove</button>`;
  //   document.getElementById('itinerary-list').appendChild(newItinerary);
  //   updateNameAttributes('itinerary-list', 'itineraries');
  // });

//   // General removal handler for dynamic items and updating names after removal
//   document.addEventListener('click', (e) => {
//     if (e.target && e.target.classList.contains('remove-btn')) {
//       const parentList = e.target.closest('ul');
//       e.target.parentElement.remove();
//       // Update name attributes after an item is removed
//       if (parentList.id === 'estimated-price-list') updateNameAttributes('estimated-price-list', 'estimated_prices');
//       else if (parentList.id === 'inclusions-list') updateNameAttributes('inclusions-list', 'inclusions');
//       else if (parentList.id === 'exclusions-list') updateNameAttributes('exclusions-list', 'exclusions');
//       else if (parentList.id === 'itinerary-list') updateNameAttributes('itinerary-list', 'itineraries');
//     }
//   });








// document.addEventListener('DOMContentLoaded', function () {
//   // ** Open "Add Package" modal **
//   document.getElementById('open-form-btn').addEventListener('click', () => {
//     document.getElementById('form-modal').classList.add('show');
//     document.getElementById('modal-overlay').classList.add('show');
//   });

//   // ** Close "Add Package" modal **
//   document.getElementById('close-form-modal').addEventListener('click', () => {
//     document.getElementById('form-modal').classList.remove('show');
//     document.getElementById('modal-overlay').classList.remove('show');
//   });

//   // ** Open "View Package" modal **
//   document.querySelectorAll('.view-package').forEach(button => {
//     button.addEventListener('click', async function () {
//       const packageId = this.getAttribute('data-package-id'); // Get package ID

//       try {
//         // Fetch package details from server
//         const response = await fetch(`/touroperator/get_tour_package/${packageId}`);
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();

//         // Populate modal content
//         const modal = document.getElementById('tour-details-modal');
//         // modal.querySelector('.modal-header-image').src = data.package_img
//         //   ? `/static/package_pics/${data.package_img}`
//         //   : '/static/default.jpg';

//         // // Populate modal header image
//         // const modal = document.getElementById('tour-details-modal');
//         // document.querySelector('.modal-header-image').src = data.package_img
//         // ? `/static/${data.package_img}` // Use the relative path stored in the database
//         // : '/static/default.jpg'; // Fallback image


//         modal.querySelector('.modal-title').textContent = data.name || 'Unnamed Package';
//         modal.querySelector('.description').textContent = data.description || 'No description provided';

//         // Populate estimated prices
//         const priceList = modal.querySelector('.price-list');
//         priceList.innerHTML = '';
//         data.estimated_prices.forEach(price => {
//           const priceItem = document.createElement('li');
//           priceItem.textContent = `${price.description}: ₱${price.estimated_price}`;
//           priceList.appendChild(priceItem);
//         });

//         // Populate inclusions
//         const inclusionsList = modal.querySelector('.inclusions-list');
//         inclusionsList.innerHTML = '';
//         data.inclusions.forEach(inclusion => {
//           const inclusionItem = document.createElement('li');
//           inclusionItem.innerHTML = `<span class="checkmark">&#10003;</span> ${inclusion.inclusion}`;
//           inclusionsList.appendChild(inclusionItem);
//         });

//         // Populate exclusions
//         const exclusionsList = modal.querySelector('.exclusions-list');
//         exclusionsList.innerHTML = '';
//         data.exclusions.forEach(exclusion => {
//           const exclusionItem = document.createElement('li');
//           exclusionItem.innerHTML = `<span class="crossmark">&#10007;</span> ${exclusion.exclusion}`;
//           exclusionsList.appendChild(exclusionItem);
//         });

//         // Populate itinerary
//         const itineraryList = modal.querySelector('.itinerary-list');
//         itineraryList.innerHTML = '';
//         data.itineraries.forEach(item => {
//           const itineraryItem = document.createElement('li');
//           itineraryItem.innerHTML = `
//             <span class="timeline-dot"></span>
//             <div class="timeline-content"><strong>${item.title}:</strong> ${item.subtitle}</div>`;
//           itineraryList.appendChild(itineraryItem);
//         });

//         // Add functionality to "Edit" and "Delete" buttons
//         const editButton = modal.querySelector('#edit-package');
//         const deleteButton = modal.querySelector('#delete-package');

//         editButton.onclick = () => {
//           openEditForm(data); // Call a function to populate the edit form
//         };

//         deleteButton.onclick = async () => {
//           const confirmDelete = confirm(`Are you sure you want to delete the package "${data.name}"?`);
//           if (confirmDelete) {
//             try {
//               const deleteResponse = await fetch(`/touroperator/delete_tour_package/${packageId}`, { method: 'DELETE' });
//               if (deleteResponse.ok) {
//                 alert('Package deleted successfully.');
//                 document.getElementById(`package-card-${packageId}`).remove(); // Remove card from UI
//                 closeModal();
//               } else {
//                 alert('Failed to delete the package. Please try again.');
//               }
//             } catch (err) {
//               console.error('Error deleting package:', err);
//               alert('An error occurred while deleting the package.');
//             }
//           }
//         };

//         // Show the modal
//         modal.classList.add('show');
//         document.getElementById('modal-overlay').classList.add('show');
//       } catch (error) {
//         console.error("Failed to load package details:", error);
//         alert('Could not load package details. Please try again.');
//       }
//     });
//   });

//   // Close modal when the close buttons or overlay are clicked
//   const closeModal = () => {
//     document.getElementById('tour-details-modal').classList.remove('show');
//     document.getElementById('modal-overlay').classList.remove('show');
//   };
//   document.getElementById('close-modal').addEventListener('click', closeModal);
//   document.getElementById('modal-overlay').addEventListener('click', closeModal);

//   // Open edit form and populate data
//   const openEditForm = (data) => {
//     const formModal = document.getElementById('form-modal');
//     formModal.classList.add('show');
//     document.getElementById('modal-overlay').classList.add('show');

//     // Populate form fields
//     document.getElementById('package-name').value = data.name || '';
//     document.getElementById('description').value = data.description || '';

//     // Handle file input (leave empty for user to upload a new file)
//     document.getElementById('image-upload').value = '';

//     // Populate inclusions
//     const inclusionsList = document.getElementById('inclusions-list');
//     inclusionsList.innerHTML = '';
//     data.inclusions.forEach(inclusion => {
//       const inclusionItem = document.createElement('li');
//       inclusionItem.innerHTML = `
//         <input type="text" name="inclusions[]" value="${inclusion.inclusion}" class="editable-item" />
//         <button type="button" class="remove-btn">Remove</button>`;
//       inclusionsList.appendChild(inclusionItem);
//     });

//     // Populate exclusions
//     const exclusionsList = document.getElementById('exclusions-list');
//     exclusionsList.innerHTML = '';
//     data.exclusions.forEach(exclusion => {
//       const exclusionItem = document.createElement('li');
//       exclusionItem.innerHTML = `
//         <input type="text" name="exclusions[]" value="${exclusion.exclusion}" class="editable-item" />
//         <button type="button" class="remove-btn">Remove</button>`;
//       exclusionsList.appendChild(exclusionItem);
//     });

//     // Populate itinerary
//     const itineraryList = document.getElementById('itinerary-list');
//     itineraryList.innerHTML = '';
//     data.itineraries.forEach(item => {
//       const itineraryItem = document.createElement('li');
//       itineraryItem.innerHTML = `
//         <input type="text" name="itinerary_title[]" value="${item.title}" class="editable-item" />
//         <input type="text" name="itinerary_subtitle[]" value="${item.subtitle}" class="editable-item" />
//         <button type="button" class="remove-btn">Remove</button>`;
//       itineraryList.appendChild(itineraryItem);
//     });
//   };



  
//     // ** Add functionality for dynamic inclusions, exclusions, itinerary, and estimated prices in "Add Package" modal **
  
//     // Add Estimated Price
//     document.getElementById('add-estimated-price-btn').addEventListener('click', function() {
//       const list = document.getElementById('estimated-price-list');
//       const newItem = document.createElement('li');
//       newItem.innerHTML = `
//         <input type="text" name="estimated_price_description[]" placeholder="Description" class="editable-item" />
//         <input type="text" name="estimated_price_value[]" placeholder="Price" class="editable-item" />
//         <button type="button" class="remove-btn">Remove</button>`;
//       list.appendChild(newItem);
//     });
  
//     // Add Inclusions
//     document.getElementById('add-inclusion-btn').addEventListener('click', function() {
//       const list = document.getElementById('inclusions-list');
//       const newItem = document.createElement('li');
//       newItem.innerHTML = `
//         <input type="text" name="inclusions[]" placeholder="Add inclusion" class="editable-item" />
//         <button type="button" class="remove-btn">Remove</button>`;
//       list.appendChild(newItem);
//     });
  
//     // Add Exclusions
//     document.getElementById('add-exclusion-btn').addEventListener('click', function() {
//       const list = document.getElementById('exclusions-list');
//       const newItem = document.createElement('li');
//       newItem.innerHTML = `
//         <input type="text" name="exclusions[]" placeholder="Add exclusion" class="editable-item" />
//         <button type="button" class="remove-btn">Remove</button>`;
//       list.appendChild(newItem);
//     });
  
//     // Add Itinerary
//     document.getElementById('add-itinerary-btn').addEventListener('click', function() {
//       const list = document.getElementById('itinerary-list');
//       const newItem = document.createElement('li');
//       newItem.innerHTML = `
//         <input type="text" name="itinerary_title[]" placeholder="Title" class="editable-item" />
//         <input type="text" name="itinerary_subtitle[]" placeholder="Subtitle" class="editable-item" />
//         <button type="button" class="remove-btn">Remove</button>`;
//       list.appendChild(newItem);
//     });
  
//     // ** Remove dynamic items on "Remove" button click **
//     document.addEventListener('click', function(e) {
//       if (e.target && e.target.classList.contains('remove-btn')) {
//         e.target.parentElement.remove();
//       }
//     });
//   });




document.addEventListener('DOMContentLoaded', function () {
  const formModal = document.getElementById('form-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const formTitle = document.querySelector('#form-modal h3');
  const submitButton = document.querySelector('#tour-package-form button[type="submit"]');

  // Open "Add Package" Modal
  document.getElementById('open-form-btn').addEventListener('click', () => {
    resetForm(); // Clear form fields before opening
    formTitle.textContent = 'Create Tour Package';
    submitButton.textContent = 'Create'; // Set button to "Create"
    formModal.classList.add('show');
    modalOverlay.classList.add('show');
  });

  // Close "Add Package" Modal
  document.getElementById('close-form-modal').addEventListener('click', () => {
    formModal.classList.remove('show');
    modalOverlay.classList.remove('show');
  });

  // Add Dynamic Estimated Price Fields
  document.getElementById('add-estimated-price-btn').addEventListener('click', function () {
    const list = document.getElementById('estimated-price-list');
    const newItem = document.createElement('li');
    newItem.innerHTML = `
      <input type="text" name="estimated_price_description[]" placeholder="Description" class="editable-item" />
      <input type="text" name="estimated_price_value[]" placeholder="Price" class="editable-item" />
      <button type="button" class="remove-btn">Remove</button>`;
    list.appendChild(newItem);
  });

  // Add Dynamic Inclusions Fields
  document.getElementById('add-inclusion-btn').addEventListener('click', function () {
    const list = document.getElementById('inclusions-list');
    const newItem = document.createElement('li');
    newItem.innerHTML = `
      <input type="text" name="inclusions[]" placeholder="Add inclusion" class="editable-item" />
      <button type="button" class="remove-btn">Remove</button>`;
    list.appendChild(newItem);
  });

  // Add Dynamic Exclusions Fields
  document.getElementById('add-exclusion-btn').addEventListener('click', function () {
    const list = document.getElementById('exclusions-list');
    const newItem = document.createElement('li');
    newItem.innerHTML = `
      <input type="text" name="exclusions[]" placeholder="Add exclusion" class="editable-item" />
      <button type="button" class="remove-btn">Remove</button>`;
    list.appendChild(newItem);
  });

  // Add Dynamic Itinerary Fields
  document.getElementById('add-itinerary-btn').addEventListener('click', function () {
    const list = document.getElementById('itinerary-list');
    const newItem = document.createElement('li');
    newItem.innerHTML = `
      <input type="text" name="itinerary_title[]" placeholder="Title" class="editable-item" />
      <input type="text" name="itinerary_subtitle[]" placeholder="Subtitle" class="editable-item" />
      <button type="button" class="remove-btn">Remove</button>`;
    list.appendChild(newItem);
  });

  // Remove Dynamic Items
  document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('remove-btn')) {
      e.target.parentElement.remove();
    }
  });

  // Open Edit Form with Existing Data
  document.querySelectorAll('.edit-package').forEach(button => {
    button.addEventListener('click', async function () {
      const packageId = this.getAttribute('data-package-id'); // Get package ID
      formTitle.textContent = 'Edit Tour Package'; // Change modal title
      submitButton.textContent = 'Save'; // Change button to "Save"
      formModal.classList.add('show');
      modalOverlay.classList.add('show');

      try {
        const response = await fetch(`/touroperator/get_tour_package/${packageId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch package details.');
        }
        const data = await response.json();

        // Populate form fields with fetched data
        populateEditForm(data, packageId);
      } catch (error) {
        console.error('Error loading package details for edit:', error);
        alert('Failed to load package details.');
      }
    });
  });

  // Function to Populate Form with Package Data
  function populateEditForm(data, packageId) {
    document.getElementById('package-name').value = data.name || '';
    document.getElementById('description').value = data.description || '';
    document.getElementById('image-upload').value = ''; // Leave file input empty for new uploads
    document.getElementById('tour-package-form').action = `/touroperator/edit_tour_package/${packageId}`; // Set form action dynamically

    populateDynamicList('estimated-price-list', data.estimated_prices, 'description', 'estimated_price', ['Description', 'Price']);
    populateDynamicList('inclusions-list', data.inclusions, 'inclusion', null, ['Inclusion']);
    populateDynamicList('exclusions-list', data.exclusions, 'exclusion', null, ['Exclusion']);
    populateDynamicList('itinerary-list', data.itineraries, 'title', 'subtitle', ['Title', 'Subtitle']);
  }

  // Populate Dynamic List Fields
  function populateDynamicList(listId, items, key1, key2, placeholders) {
    const list = document.getElementById(listId);
    list.innerHTML = '';
    items.forEach(item => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <input type="text" name="${listId}[]" value="${item[key1]}" placeholder="${placeholders[0]}" class="editable-item" />
        ${key2 ? `<input type="text" name="${listId}[]" value="${item[key2]}" placeholder="${placeholders[1]}" class="editable-item" />` : ''}
        <button type="button" class="remove-btn">Remove</button>`;
      list.appendChild(listItem);
    });
  }

  // Reset Form Fields for "Add Package"
  function resetForm() {
    document.getElementById('tour-package-form').reset();
    document.getElementById('estimated-price-list').innerHTML = '';
    document.getElementById('inclusions-list').innerHTML = '';
    document.getElementById('exclusions-list').innerHTML = '';
    document.getElementById('itinerary-list').innerHTML = '';
    document.getElementById('tour-package-form').action = '/touroperator/create_tour_package'; // Reset form action
  }
});






document.addEventListener('DOMContentLoaded', function () {
  // Open "View Package" Modal
  document.querySelectorAll('.view-package').forEach(button => {
    button.addEventListener('click', async function () {
      const packageId = this.getAttribute('data-package-id'); // Get the package ID

      try {
        // Fetch the package details from the server
        const response = await fetch(`/touroperator/get_tour_package/${packageId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch package details.");
        }
        const data = await response.json();

        // Populate Modal Content
        const modal = document.getElementById('tour-details-modal');
        modal.querySelector('.modal-header-image').src = data.package_img
          ? `/static/${data.package_img}`
          : '/static/default.jpg';
        modal.querySelector('.modal-title').textContent = data.name || 'Unnamed Package';
        modal.querySelector('.description').textContent = data.description || 'No description provided';

        // Populate Estimated Prices
        const priceList = modal.querySelector('.price-list');
        priceList.innerHTML = '';
        data.estimated_prices.forEach(price => {
          const priceItem = document.createElement('li');
          priceItem.textContent = `${price.description}: ₱${price.estimated_price}`;
          priceList.appendChild(priceItem);
        });

        // Populate Inclusions
        const inclusionsList = modal.querySelector('.inclusions-list');
        inclusionsList.innerHTML = '';
        data.inclusions.forEach(inclusion => {
          const inclusionItem = document.createElement('li');
          inclusionItem.innerHTML = `<span class="checkmark">&#10003;</span> ${inclusion.inclusion}`;
          inclusionsList.appendChild(inclusionItem);
        });

        // Populate Exclusions
        const exclusionsList = modal.querySelector('.exclusions-list');
        exclusionsList.innerHTML = '';
        data.exclusions.forEach(exclusion => {
          const exclusionItem = document.createElement('li');
          exclusionItem.innerHTML = `<span class="crossmark">&#10007;</span> ${exclusion.exclusion}`;
          exclusionsList.appendChild(exclusionItem);
        });

        // Populate Itinerary
        const itineraryList = modal.querySelector('.itinerary-list');
        itineraryList.innerHTML = '';
        data.itineraries.forEach(item => {
          const itineraryItem = document.createElement('li');
          itineraryItem.innerHTML = `
            <span class="timeline-dot"></span>
            <div class="timeline-content"><strong>${item.title}:</strong> ${item.subtitle}</div>`;
          itineraryList.appendChild(itineraryItem);
        });

        // Show Modal
        modal.classList.add('show');
        document.getElementById('modal-overlay').classList.add('show');

        // Populate delete functionality
        addDeleteFunctionality(packageId);

        // Attach "Edit" functionality
        const editButton = document.getElementById('edit-package');
        editButton.onclick = function () {
          openEditForm(packageId, data); // Pass package ID and details to the form
          modal.classList.remove('show'); // Close the view modal
        };

      } catch (error) {
        console.error("Failed to load package details:", error);
        alert('Could not load package details. Please try again.');
      }
    });
  });

  // Close Modal
  const closeModal = () => {
    document.getElementById('tour-details-modal').classList.remove('show');
    document.getElementById('modal-overlay').classList.remove('show');
  };
  document.getElementById('close-modal').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', closeModal);
});




// Open and Populate Edit Form
function openEditForm(packageId, data) {
  const formModal = document.getElementById('form-modal');
  const modalOverlay = document.getElementById('modal-overlay');

  // Populate form fields with package data
  document.getElementById('package-name').value = data.name || '';
  document.getElementById('description').value = data.description || '';

  // Leave file input empty for the user to upload a new file if needed
  document.getElementById('image-upload').value = '';

  // Populate Estimated Prices
  const priceList = document.getElementById('estimated-price-list');
  priceList.innerHTML = '';
  data.estimated_prices.forEach(price => {
    const priceItem = document.createElement('li');
    priceItem.innerHTML = `
      <input type="text" name="estimated_price_description[]" value="${price.description}" placeholder="Description" class="editable-item" />
      <input type="text" name="estimated_price_value[]" value="${price.estimated_price}" placeholder="Price" class="editable-item" />
      <button type="button" class="remove-btn">Remove</button>`;
    priceList.appendChild(priceItem);
  });

  // Populate Inclusions
  const inclusionsList = document.getElementById('inclusions-list');
  inclusionsList.innerHTML = '';
  data.inclusions.forEach(inclusion => {
    const inclusionItem = document.createElement('li');
    inclusionItem.innerHTML = `
      <input type="text" name="inclusions[]" value="${inclusion.inclusion}" class="editable-item" />
      <button type="button" class="remove-btn">Remove</button>`;
    inclusionsList.appendChild(inclusionItem);
  });

  // Populate Exclusions
  const exclusionsList = document.getElementById('exclusions-list');
  exclusionsList.innerHTML = '';
  data.exclusions.forEach(exclusion => {
    const exclusionItem = document.createElement('li');
    exclusionItem.innerHTML = `
      <input type="text" name="exclusions[]" value="${exclusion.exclusion}" class="editable-item" />
      <button type="button" class="remove-btn">Remove</button>`;
    exclusionsList.appendChild(exclusionItem);
  });

  // Populate Itinerary
  const itineraryList = document.getElementById('itinerary-list');
  itineraryList.innerHTML = '';
  data.itineraries.forEach(item => {
    const itineraryItem = document.createElement('li');
    itineraryItem.innerHTML = `
      <input type="text" name="itinerary_title[]" value="${item.title}" class="editable-item" />
      <input type="text" name="itinerary_subtitle[]" value="${item.subtitle}" class="editable-item" />
      <button type="button" class="remove-btn">Remove</button>`;
    itineraryList.appendChild(itineraryItem);
  });

  // Change form action for editing
  document.getElementById('tour-package-form').action = `/touroperator/edit_tour_package/${packageId}`;

  // Change the button text to "Save"
  const submitButton = document.querySelector('#tour-package-form button[type="submit"]');
  submitButton.textContent = 'Save';

  // Show the form modal
  formModal.classList.add('show');
  modalOverlay.classList.add('show');
}
/**
 * Add functionality to the "Delete" button.
 * @param {Number} packageId - The ID of the package to delete.
 */
function addDeleteFunctionality(packageId) {
  const deleteButton = document.getElementById('delete-package');

  // Ensure the delete button exists
  if (!deleteButton) {
    console.error('Delete button not found!');
    return;
  }

  deleteButton.onclick = async () => {
    const confirmDelete = confirm('Are you sure you want to delete this package?');
    if (confirmDelete) {
      try {
        // Send DELETE request to the server
        const deleteResponse = await fetch(`/touroperator/delete_tour_package/${packageId}`, {
          method: 'DELETE',
        });

        if (deleteResponse.ok) {
          // Remove the package card from the UI
          const packageCard = document.querySelector(`[data-package-id="${packageId}"]`);
          if (packageCard) {
            packageCard.closest('.card').remove(); // Adjust selector if the card structure differs
          } else {
            console.warn(`Package card with ID ${packageId} not found.`);
          }

          // Close the modal
          closeModal();

          alert('Package deleted successfully.');
        } else {
          const errorMessage = await deleteResponse.json();
          alert(errorMessage.error || 'Failed to delete the package. Please try again.');
        }
      } catch (err) {
        console.error('Error deleting package:', err);
        alert('An error occurred while deleting the package.');
      }
    }
  };
}

/**
 * Close the modal by removing the "show" class.
 */
function closeModal() {
  document.getElementById('tour-details-modal').classList.remove('show');
  document.getElementById('modal-overlay').classList.remove('show');
}


/**
 * Close the modal by removing the "show" class.
 */
function closeModal() {
  document.getElementById('tour-details-modal').classList.remove('show');
  document.getElementById('modal-overlay').classList.remove('show');
}




// document.addEventListener('DOMContentLoaded', function () {
//   // Open "Add Package" Modal
//   document.getElementById('open-form-btn').addEventListener('click', () => {
//     document.getElementById('form-modal').classList.add('show');
//     document.getElementById('modal-overlay').classList.add('show');
//   });

//   // Close "Add Package" Modal
//   document.getElementById('close-form-modal').addEventListener('click', () => {
//     document.getElementById('form-modal').classList.remove('show');
//     document.getElementById('modal-overlay').classList.remove('show');
//   });

//   // Add Dynamic Estimated Price Fields
//   document.getElementById('add-estimated-price-btn').addEventListener('click', function () {
//     const list = document.getElementById('estimated-price-list');
//     const newItem = document.createElement('li');
//     newItem.innerHTML = `
//       <input type="text" name="estimated_price_description[]" placeholder="Description" class="editable-item" />
//       <input type="text" name="estimated_price_value[]" placeholder="Price" class="editable-item" />
//       <button type="button" class="remove-btn">Remove</button>`;
//     list.appendChild(newItem);
//   });

//   // Add Dynamic Inclusions Fields
//   document.getElementById('add-inclusion-btn').addEventListener('click', function () {
//     const list = document.getElementById('inclusions-list');
//     const newItem = document.createElement('li');
//     newItem.innerHTML = `
//       <input type="text" name="inclusions[]" placeholder="Add inclusion" class="editable-item" />
//       <button type="button" class="remove-btn">Remove</button>`;
//     list.appendChild(newItem);
//   });

//   // Add Dynamic Exclusions Fields
//   document.getElementById('add-exclusion-btn').addEventListener('click', function () {
//     const list = document.getElementById('exclusions-list');
//     const newItem = document.createElement('li');
//     newItem.innerHTML = `
//       <input type="text" name="exclusions[]" placeholder="Add exclusion" class="editable-item" />
//       <button type="button" class="remove-btn">Remove</button>`;
//     list.appendChild(newItem);
//   });

//   // Add Dynamic Itinerary Fields
//   document.getElementById('add-itinerary-btn').addEventListener('click', function () {
//     const list = document.getElementById('itinerary-list');
//     const newItem = document.createElement('li');
//     newItem.innerHTML = `
//       <input type="text" name="itinerary_title[]" placeholder="Title" class="editable-item" />
//       <input type="text" name="itinerary_subtitle[]" placeholder="Subtitle" class="editable-item" />
//       <button type="button" class="remove-btn">Remove</button>`;
//     list.appendChild(newItem);
//   });

//   // Remove Dynamic Items
//   document.addEventListener('click', function (e) {
//     if (e.target && e.target.classList.contains('remove-btn')) {
//       e.target.parentElement.remove();
//     }
//   });
// });




// document.addEventListener('DOMContentLoaded', function () {
//   // Open "View Package" Modal
//   document.querySelectorAll('.view-package').forEach(button => {
//     button.addEventListener('click', async function () {
//       const packageId = this.getAttribute('data-package-id');

//       try {
//         const response = await fetch(`/touroperator/get_tour_package/${packageId}`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch package details.");
//         }
//         const data = await response.json();

//         // Populate Modal Content
//         const modal = document.getElementById('tour-details-modal');
//         modal.querySelector('.modal-header-image').src = data.package_img
//           ? `/static/${data.package_img}`
//           : '/static/default.jpg';
//         modal.querySelector('.modal-title').textContent = data.name || 'Unnamed Package';
//         modal.querySelector('.description').textContent = data.description || 'No description provided';

//         // Populate delete functionality
//         addDeleteFunctionality(packageId);

//         // In openViewPackageModal
//         document.getElementById('edit-package').setAttribute('data-package-id', packageId);


//         // Populate Estimated Prices
//         const priceList = modal.querySelector('.price-list');
//         priceList.innerHTML = '';
//         data.estimated_prices.forEach(price => {
//           const priceItem = document.createElement('li');
//           priceItem.textContent = `${price.description}: ₱${price.estimated_price}`;
//           priceList.appendChild(priceItem);
//         });

//         // Populate Inclusions
//         const inclusionsList = modal.querySelector('.inclusions-list');
//         inclusionsList.innerHTML = '';
//         data.inclusions.forEach(inclusion => {
//           const inclusionItem = document.createElement('li');
//           inclusionItem.innerHTML = `<span class="checkmark">&#10003;</span> ${inclusion.inclusion}`;
//           inclusionsList.appendChild(inclusionItem);
//         });

//         // Populate Exclusions
//         const exclusionsList = modal.querySelector('.exclusions-list');
//         exclusionsList.innerHTML = '';
//         data.exclusions.forEach(exclusion => {
//           const exclusionItem = document.createElement('li');
//           exclusionItem.innerHTML = `<span class="crossmark">&#10007;</span> ${exclusion.exclusion}`;
//           exclusionsList.appendChild(exclusionItem);
//         });

//         // Populate Itinerary
//         const itineraryList = modal.querySelector('.itinerary-list');
//         itineraryList.innerHTML = '';
//         data.itineraries.forEach(item => {
//           const itineraryItem = document.createElement('li');
//           itineraryItem.innerHTML = `
//             <span class="timeline-dot"></span>
//             <div class="timeline-content"><strong>${item.title}:</strong> ${item.subtitle}</div>`;
//           itineraryList.appendChild(itineraryItem);
//         });

//         // Show Modal
//         modal.classList.add('show');
//         document.getElementById('modal-overlay').classList.add('show');
//       } catch (error) {
//         console.error("Failed to load package details:", error);
//         alert('Could not load package details. Please try again.');
//       }
//     });
//   });

//   // Close Modal
//   const closeModal = () => {
//     document.getElementById('tour-details-modal').classList.remove('show');
//     document.getElementById('modal-overlay').classList.remove('show');
//   };
//   document.getElementById('close-modal').addEventListener('click', closeModal);
//   document.getElementById('modal-overlay').addEventListener('click', closeModal);
// });




// /**
//  * Add functionality to the "Delete" button.
//  * @param {Number} packageId - The ID of the package to delete.
//  */
// function addDeleteFunctionality(packageId) {
//   const deleteButton = document.getElementById('delete-package');
//   deleteButton.onclick = async () => {
//     const confirmDelete = confirm('Are you sure you want to delete the package?');
//     if (confirmDelete) {
//       try {
//         const deleteResponse = await fetch(`/touroperator/delete_tour_package/${packageId}`, {
//           method: 'DELETE',
//         });

//         if (deleteResponse.ok) {
//           alert('Package deleted successfully.');
//           document.getElementById(`package-card-${packageId}`).remove(); // Remove card from UI
//           closeModal('tour-details-modal');
//         } else {
//           const errorMessage = await deleteResponse.json();
//           alert(errorMessage.error || 'Failed to delete the package. Please try again.');
//         }
//       } catch (err) {
//         console.error('Error deleting package:', err);
//         alert('An error occurred while deleting the package.');
//       }
//     }
//   };
// }




// // Function to open and populate the edit form
// function openEditForm(packageId) {
//   const formModal = document.getElementById('form-modal');
//   const modalOverlay = document.getElementById('modal-overlay');

//   fetch(`/touroperator/get_tour_package/${packageId}`)
//     .then(response => {
//       if (!response.ok) throw new Error('Failed to fetch package details');
//       return response.json();
//     })
//     .then(data => {
//       // Populate the form fields with package data
//       document.getElementById('package-name').value = data.name || '';
//       document.getElementById('description').value = data.description || '';

//       // Handle file input (leave empty for user to upload a new file)
//       document.getElementById('image-upload').value = '';

//       // Populate Estimated Prices
//       const priceList = document.getElementById('estimated-price-list');
//       priceList.innerHTML = '';
//       data.estimated_prices.forEach(price => {
//         const priceItem = document.createElement('li');
//         priceItem.innerHTML = `
//           <input type="text" name="estimated_price_description[]" value="${price.description}" placeholder="Description" class="editable-item" />
//           <input type="text" name="estimated_price_value[]" value="${price.estimated_price}" placeholder="Price" class="editable-item" />
//           <button type="button" class="remove-btn">Remove</button>`;
//         priceList.appendChild(priceItem);
//       });

//       // Populate Inclusions
//       const inclusionsList = document.getElementById('inclusions-list');
//       inclusionsList.innerHTML = '';
//       data.inclusions.forEach(inclusion => {
//         const inclusionItem = document.createElement('li');
//         inclusionItem.innerHTML = `
//           <input type="text" name="inclusions[]" value="${inclusion.inclusion}" class="editable-item" />
//           <button type="button" class="remove-btn">Remove</button>`;
//         inclusionsList.appendChild(inclusionItem);
//       });

//       // Populate Exclusions
//       const exclusionsList = document.getElementById('exclusions-list');
//       exclusionsList.innerHTML = '';
//       data.exclusions.forEach(exclusion => {
//         const exclusionItem = document.createElement('li');
//         exclusionItem.innerHTML = `
//           <input type="text" name="exclusions[]" value="${exclusion.exclusion}" class="editable-item" />
//           <button type="button" class="remove-btn">Remove</button>`;
//         exclusionsList.appendChild(exclusionItem);
//       });

//       // Populate Itinerary
//       const itineraryList = document.getElementById('itinerary-list');
//       itineraryList.innerHTML = '';
//       data.itineraries.forEach(item => {
//         const itineraryItem = document.createElement('li');
//         itineraryItem.innerHTML = `
//           <input type="text" name="itinerary_title[]" value="${item.title}" class="editable-item" />
//           <input type="text" name="itinerary_subtitle[]" value="${item.subtitle}" class="editable-item" />
//           <button type="button" class="remove-btn">Remove</button>`;
//         itineraryList.appendChild(itineraryItem);
//       });

//       // Set the form action dynamically
//       document.getElementById('tour-package-form').action = `/touroperator/edit_tour_package/${packageId}`;

//       // Show the form modal
//       formModal.classList.add('show');
//       modalOverlay.classList.add('show');
//     })
//     .catch(err => {
//       console.error('Error loading package details for edit:', err);
//       alert('Failed to load package details.');
//     });
// }

// // Attach the Edit button functionality
// document.getElementById('edit-package').addEventListener('click', function () {
//   const packageId = this.getAttribute('data-package-id');
//   openEditForm(packageId);
// });





document.addEventListener('DOMContentLoaded', async () => {
  const reviewsContainer = document.getElementById('traveler-reviews');
  const paginationControls = document.getElementById('pagination-controls');
  const reviewsHeader = document.querySelector('.reviews-header .total-reviews');
  const tourGuideId = reviewsContainer.dataset.tourGuideId; // Use this for the API call
  const reviewsPerPage = 2; // Reviews per page
  let currentPage = 1;

  // Fetch paginated reviews from the server
  const fetchReviews = async (page = 1) => {
      const response = await fetch(`/reviews?tour_guide_id=${tourGuideId}&page=${page}&per_page=${reviewsPerPage}`);
      return await response.json();
  };

  // Render Pagination Controls
  const renderPagination = (currentPage, totalPages) => {
      paginationControls.innerHTML = '';
      if (totalPages <= 1) return;

      // Previous Button
      const prev = document.createElement('a');
      prev.innerHTML = '&lt;';
      prev.className = currentPage === 1 ? 'disabled' : '';
      prev.href = '#';
      prev.addEventListener('click', (event) => {
          event.preventDefault();
          if (currentPage > 1) loadReviews(currentPage - 1);
      });
      paginationControls.appendChild(prev);

      // Page Numbers with "..." for skipped pages
      const maxVisiblePages = 3;
      const renderPageNumbers = () => {
          const pages = [];
          for (let i = 1; i <= totalPages; i++) {
              if (
                  i === 1 || 
                  i === totalPages || 
                  (i >= currentPage - 1 && i <= currentPage + 1)
              ) {
                  pages.push(i);
              } else if (
                  pages[pages.length - 1] !== '...'
              ) {
                  pages.push('...');
              }
          }
          return pages;
      };

      renderPageNumbers().forEach((page) => {
          if (page === '...') {
              const dots = document.createElement('span');
              dots.innerHTML = '...';
              dots.className = 'pagination-ellipsis';
              paginationControls.appendChild(dots);
          } else {
              const pageLink = document.createElement('a');
              pageLink.innerHTML = page;
              pageLink.className = currentPage === page ? 'active' : '';
              pageLink.href = '#';
              pageLink.addEventListener('click', (event) => {
                  event.preventDefault();
                  loadReviews(page);
              });
              paginationControls.appendChild(pageLink);
          }
      });

      // Next Button
      const next = document.createElement('a');
      next.innerHTML = '&gt;';
      next.className = currentPage === totalPages ? 'disabled' : '';
      next.href = '#';
      next.addEventListener('click', (event) => {
          event.preventDefault();
          if (currentPage < totalPages) loadReviews(currentPage + 1);
      });
      paginationControls.appendChild(next);
  };

  // Load Reviews and Update UI
  const loadReviews = async (page) => {
      const { html, total_reviews, total_pages } = await fetchReviews(page);

      reviewsContainer.innerHTML = html;

      // Update total reviews count and pagination
      currentPage = page;
      reviewsHeader.textContent = `(${total_reviews})`;
      renderPagination(page, total_pages);

      // Ensure the page doesn't scroll
      reviewsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Initial Load
  loadReviews(currentPage);
});


document.addEventListener('DOMContentLoaded', function () {
  const filterDropdown = document.getElementById('tour-guide-filter');
  const reviewsContainer = document.querySelector('.reviews-grid');
  const paginationContainer = document.querySelector('.pagination-container');

  const fetchFilteredReviews = async (tourGuideId = '') => {
    try {
      const response = await fetch(`/dashboard?tour_guide_id=${tourGuideId}`);
      const data = await response.json();

      // Update reviews grid
      reviewsContainer.innerHTML = '';
      data.reviews.forEach(review => {
        const reviewCard = `
          <div class="review-card">
            <img src="${review.tour_image}" alt="Tour Picture" class="tour-image" />
            <div class="review-content">
              <div class="traveler-info">
                <img src="${review.traveler_profile}" alt="Traveler Picture" class="traveler-pic" />
                <div class="traveler-details">
                  <h3>${review.traveler_name}</h3>
                  <p class="tour-name">Tour Package</p>
                  <div class="ratings"><p>${review.rating} ★</p></div>
                </div>
              </div>
              <p class="review-text">${review.comment}</p>
              <div class="review-footer">
                <p class="review-date">${review.review_date}</p>
                <p class="toured-by">Toured by: <span class="tour-guide-name">${review.tour_guide_name}</span></p>
              </div>
            </div>
          </div>
        `;
        reviewsContainer.innerHTML += reviewCard;
      });

      // Update pagination
      paginationContainer.innerHTML = ''; // Update as needed based on pagination logic
    } catch (error) {
      console.error('Failed to fetch filtered reviews:', error);
    }
  };

  filterDropdown.addEventListener('change', (e) => {
    const selectedTourGuideId = e.target.value;
    fetchFilteredReviews(selectedTourGuideId);
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const filterDropdown = document.getElementById('tour-guide-filter');

  filterDropdown.addEventListener('change', () => {
    const selectedTourGuideId = filterDropdown.value;
    const urlParams = new URLSearchParams(window.location.search);

    if (selectedTourGuideId) {
      urlParams.set('tour_guide_id', selectedTourGuideId);
    } else {
      urlParams.delete('tour_guide_id');
    }

    urlParams.set('page', 1); // Reset to the first page when filtering
    window.location.search = urlParams.toString(); // Refresh the page with the new query params
  });
});



function redirectToProfile(guideId) {
  window.location.href = `/tourguide/profile/${guideId}`;
}
