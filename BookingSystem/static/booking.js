// document.addEventListener('DOMContentLoaded', async () => {
//     const tourGuideList = document.getElementById('tour-guide-list');
  
//     try {
//       const response = await fetch('/tourguide/active_tourguides');
//       const guides = await response.json();
  
//       guides.forEach(guide => {
//         const guideCard = document.createElement('div');
//         guideCard.className = 'tour-guide-card';
  
//         guideCard.innerHTML = `
//           <div class="profile-picture">
//             <img src="${guide.profile_picture}" alt="Tour Guide Profile Picture">
//           </div>
//           <div class="guide-info">
//             <h2 class="guide-name">Mabuhay! I Am <span>${guide.name}</span>, Your Friendly Tour Guide</h2>
//             <div class="ratings">${starDisplay} (${guide.review_count || 0} Reviews)</div>
//             <p class="price">Starting Price: ₱${parseFloat(guide.price).toLocaleString()}</p>   
//             <p class="price">Starting Price: ₱${parseFloat(guide.price).toLocaleString()}</p>
//             <a href="/tourguide/profile/${guide.id}">
//               <button class="book-btn">Book Now</button>
//             </a>
//           </div>
//         `;
  
//         tourGuideList.appendChild(guideCard);
//       });
//     } catch (error) {
//       console.error("Error fetching tour guides:", error);
//     }
//   });
  



//   document.addEventListener('DOMContentLoaded', async () => {
//     const tourGuideList = document.getElementById('tour-guide-list');
  
//     try {
//       const response = await fetch('/tourguide/active_tourguides');
//       const guides = await response.json();
  
//       guides.forEach(guide => {
//         const guideCard = document.createElement('div');
//         guideCard.className = 'tour-guide-card';
        
//         // Calculate the star display based on the average rating
//         const fullStars = Math.floor(guide.average_rating);
//         const halfStar = guide.average_rating % 1 >= 0.5 ? '★' : '';
//         const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
//         const starDisplay = '★'.repeat(fullStars) + halfStar + '☆'.repeat(emptyStars);

//         guideCard.innerHTML = `
//           <div class="profile-picture">
//             <img src="${guide.profile_picture}" alt="Tour Guide Profile Picture">
//           </div>
//           <div class="guide-info">
//             <h2 class="guide-name">Mabuhay! I Am <span>${guide.name}</span>, Your Friendly Tour Guide</h2>
//             <div class="ratings">${starDisplay} (${guide.review_count || 0} Reviews)</div>
//             <p class="price">Starting Price: ₱${parseFloat(guide.price).toLocaleString()}</p>
//             <a href="/tourguide/profile/${guide.id}">
//               <button class="book-btn">Book Now</button>
//             </a>
//           </div>
//         `;
  
//         tourGuideList.appendChild(guideCard);
//       });
//     } catch (error) {
//       console.error("Error fetching tour guides:", error);
//     }
// });



// document.addEventListener('DOMContentLoaded', async () => {
//     const tourGuideList = document.getElementById('tour-guide-list');

//     try {
//         const response = await fetch('/tourguide/active_tourguides');
//         const guides = await response.json();

//         guides.forEach(guide => {
//             const guideCard = document.createElement('div');
//             guideCard.className = 'tour-guide-card';
            
//             // Calculate the star display based on the average rating
//             const fullStars = Math.floor(guide.average_rating);
//             const halfStar = guide.average_rating % 1 >= 0.5 ? '★' : '';
//             const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
//             const starDisplay = '★'.repeat(fullStars) + halfStar + '☆'.repeat(emptyStars);

//             guideCard.innerHTML = `
//                 <div class="profile-picture">
//                     <img src="${guide.profile_picture}" alt="Tour Guide Profile Picture">
//                 </div>
//                 <div class="guide-info">
//                     <h2 class="guide-name">Mabuhay! I Am <span>${guide.name}</span>, Your Friendly Tour Guide</h2>
//                     <div class="ratings">
//                         ${starDisplay} ${guide.average_rating || 0} (${guide.review_count || 0}) | ${guide.total_tours || 0} Tours
//                     </div>
//                     <p class="price">Starting Price: ₱${parseFloat(guide.price).toLocaleString()}</p>
//                     <a href="/tourguide/profile/${guide.id}">
//                         <button class="book-btn">Book Now</button>
//                     </a>
//                 </div>
//             `;

//             tourGuideList.appendChild(guideCard);
//         });
//     } catch (error) {
//         console.error("Error fetching tour guides:", error);
//     }
// });






// document.addEventListener('DOMContentLoaded', async () => {
//   const tourGuideList = document.getElementById('tour-guide-list');

//   try {
//       const response = await fetch('/tourguide/active_tourguides');
//       const guides = await response.json();

//       guides.forEach(guide => {
//           const guideCard = document.createElement('div');
//           guideCard.className = 'tour-guide-card';

//           // Use a single star, average rating, review count, and total tours
//           const ratingDisplay = `★ ${guide.average_rating || 0} (${guide.review_count || 0}) | ${guide.total_tours || 0} Tours`;

//           guideCard.innerHTML = `
//           <div class="profile-picture">
//               <img src="${guide.profile_picture}" alt="Tour Guide Profile Picture">
//           </div>
//           <div class="guide-info">
//               <h2 class="guide-name">Mabuhay! I Am <span>${guide.name}</span>, Your Friendly Tour Guide</h2>
//               <div class="ratings">
//                   <span class="star-icon">★</span>
//                   <span class="rating-value">${guide.average_rating || 0}</span>
//                   <span class="review-count">(${guide.review_count || 0})</span>
//                   <span class="separator">|</span>
//                   <span class="total-tours">${guide.total_tours || 0} <span class="tours"> Tours   </span> </span>
//               </div>
//               <p class="price">Starting Price: ₱${parseFloat(guide.price).toLocaleString()}</p>
//               <a href="/tourguide/profile/${guide.id}">
//                   <button class="book-btn">Book Now</button>
//               </a>
//           </div>
//       `;

//           tourGuideList.appendChild(guideCard);
//       });
//   } catch (error) {
//       console.error("Error fetching tour guides:", error);
//   }
// });





document.addEventListener('DOMContentLoaded', async () => {
    const tourGuideList = document.getElementById('tour-guide-list');

    try {
        const response = await fetch('/tourguide/active_tourguides');
        const guides = await response.json();

        guides.forEach(guide => {
            const guideCard = document.createElement('div');
            guideCard.className = 'tour-guide-card';

            // Update the rating and total tours display
            const ratingDisplay = `
                <span class="star-icon">★</span>
                <span class="rating-value">${guide.average_rating || 0}</span>
                <span class="review-count">(${guide.review_count || 0})</span>
                <span class="separator">|</span>
                <span class="total-tours">${guide.total_tours || 0} <span class="tours">Tours</span></span>
            `;

            guideCard.innerHTML = `
                <div class="profile-picture">
                    <img src="${guide.profile_picture}" alt="Tour Guide Profile Picture">
                </div>
                <div class="guide-info">
                    <h2 class="guide-name">Mabuhay! I Am <span>${guide.name}</span>, Your Friendly Tour Guide</h2>
                    <div class="ratings">
                        ${ratingDisplay}
                    </div>
                    <p class="price">Starting Price: ₱${parseFloat(guide.price).toLocaleString()}</p>
                    <a href="/tourguide/profile/${guide.id}">
                        <button class="book-btn">Book Now</button>
                    </a>
                </div>
            `;

            tourGuideList.appendChild(guideCard);
        });
    } catch (error) {
        console.error("Error fetching tour guides:", error);
    }
});
