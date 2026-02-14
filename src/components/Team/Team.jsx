import React, { useEffect, useState } from "react";
import "./Team.scss";
import { db, auth } from "../../firebase";
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import personLogo from "../../assets/person-logo.png";

const Team = () => {
  const [members, setMembers] = useState([]);
  const [canViewAll, setCanViewAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ecDesignations, setEcDesignations] = useState({}); // ✅ EC designation map

  const PRIORITY_MEMBERS = [
    { name: "Saravana Raja", batch: "1988" },
    { name: "Ashok Raj Vadivelu", batch: "1993" },
    { name: "Ramesh M", batch: "1983" },
    { name: "Karnan Ramamurthy", batch: "1996" },
    { name: "Satheesh S", batch: "1985" },
    { name: "Anitha S", batch: "1989" },
  ];

  // 🔐 Auth & approval check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCanViewAll(false);
        return;
      }
      const snap = await get(ref(db, `users/${user.uid}`));
      const data = snap.val();
      if (data?.extraInfo === "champs" || data?.approved === true) {
        setCanViewAll(true);
      } else {
        setCanViewAll(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        let snapshot;

        if (canViewAll) {
          snapshot = await get(ref(db, "users"));
        } else {
          snapshot = await get(ref(db, "publicTeamPreview"));
        }

        if (!snapshot.exists()) {
          setMembers([]);
          return;
        }

        const data = snapshot.val();

        // ✅ Fetch EC Members for designation
        const ecSnap = await get(ref(db, "ecMembers"));
        const ecData = ecSnap.val() || {};

        const designationMap = {};
        Object.keys(ecData).forEach((uid) => {
          if (ecData[uid]?.designation) {
            designationMap[uid] = ecData[uid].designation;
          }
        });

        setEcDesignations(designationMap);

        let list = Object.keys(data).map((uid) => ({
          id: uid,
          fullname: data[uid].fullname || "Unnamed",
          branch: data[uid].branch || "",
          batch: data[uid].batch || "",
          profession: data[uid].profession || "",
          role: data[uid].role || "",
          city: data[uid].city || "",
          state: data[uid].state || "",
          country: data[uid].country || "",
          profileImage: data[uid].profileImage || personLogo,
          designation: designationMap[uid] || "", // ✅ attach designation
          extraInfo: data[uid].extraInfo || "",
          approved: data[uid].approved || false,
        }));

        // ✅ Filter only approved champs
        if (canViewAll) {
          list = list.filter(
            (member) =>
              member.approved === true &&
              member.extraInfo === "champs"
          );

          // ✅ Priority Sorting
          const priorityList = [];
          const remainingList = [];

          list.forEach((member) => {
            const matchIndex = PRIORITY_MEMBERS.findIndex(
              (p) =>
                p.name === member.fullname &&
                p.batch === member.batch
            );

            if (matchIndex !== -1) {
              priorityList[matchIndex] = member;
            } else {
              remainingList.push(member);
            }
          });

          const orderedPriority = priorityList.filter(Boolean);
          list = [...orderedPriority, ...remainingList];
        }

        setMembers(list);
      } catch (err) {
        console.error("Team fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [canViewAll]);

  if (loading) return <p>Loading members...</p>;

  return (
    <div className="team-page">
      <h2>Team Members</h2>

      <div className={`team-grid ${!canViewAll ? "blurred" : ""}`}>
        {members.map((member) => (
          <div className="team-card" key={member.id}>
            <img
              src={member.profileImage}
              alt={member.fullname}
              className="team-profile"
            />

            <h3 className="team-name">{member.fullname}</h3>

            {/* ✅ EC Designation */}
            {member.designation && (
              <p className="team-meta">
                Designation: {member.designation}
              </p>
            )}

            {/* Branch • Batch */}
            {(member.branch || member.batch) && (
              <p className="team-meta">
                {[member.branch, member.batch]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
            )}

            {canViewAll && (
              <>
                {/* Profession */}
                {member.profession && (
                  <p className="team-meta">
                    Profession: {member.profession}
                  </p>
                )}

                {/* Location */}
                {(member.city ||
                  member.state ||
                  member.country) && (
                  <p className="team-meta">
                    Location:{" "}
                    {[member.city, member.state, member.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {!canViewAll && (
        <div className="team-overlay">
          <h3>Want to view full team details?</h3>
          <p>
            Login / Signup & get approved to unlock full access
          </p>
          <button
            onClick={() =>
              (window.location.href = "/accounts")
            }
          >
            Login / Signup
          </button>
        </div>
      )}
    </div>
  );
};

export default Team;


// import React, { useEffect, useState } from "react";
// import "./Team.scss";
// import { db, auth } from "../../firebase";
// import { ref, get } from "firebase/database";
// import { onAuthStateChanged } from "firebase/auth";
// import personLogo from "../../assets/person-logo.png";

// const Team = () => {
//   const [members, setMembers] = useState([]);
//   const [canViewAll, setCanViewAll] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const PRIORITY_MEMBERS = [
//     { name: "Saravana Raja", batch: "1988" },
//     { name: "Ashok Raj Vadivelu", batch: "1993" },
//     { name: "Ramesh M", batch: "1983" },
//     { name: "Karnan Ramamurthy", batch: "1996" },
//     { name: "Satheesh S", batch: "1985" },
//     { name: "Anitha S", batch: "1989" },
//   ];
//   const SPECIAL_ROLES = ["champs", "CEO", "Chairperson"]; // filtered roles

//   // 🔐 Auth & approval check
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (user) => {
//       if (!user) {
//         setCanViewAll(false);
//         return;
//       }
//       const snap = await get(ref(db, `users/${user.uid}`));
//       const data = snap.val();
//       if (data?.extraInfo === "champs" || data?.approved === true) {
//         setCanViewAll(true);
//       } else {
//         setCanViewAll(false);
//       }
//     });
//     return () => unsub();
//   }, []);

// useEffect(() => {
//   const fetchMembers = async () => {
//     try {
//       let snapshot;

//       if (canViewAll) {
//         snapshot = await get(ref(db, "users"));
//       } else {
//         snapshot = await get(ref(db, "publicTeamPreview"));
//       }

//       if (!snapshot.exists()) {
//         setMembers([]);
//         return;
//       }

//       const data = snapshot.val();

//       let list = Object.keys(data).map((uid) => ({
//         id: uid,
//         fullname: data[uid].fullname || "Unnamed",
//         branch: data[uid].branch || "",
//         batch: data[uid].batch || "",
//         profession: data[uid].profession || "",
//         role: data[uid].role || "",
//         city: data[uid].city || "",
//         state: data[uid].state || "",
//         country: data[uid].country || "",
//         profileImage: data[uid].profileImage || personLogo,

//         // ✅ IMPORTANT
//         extraInfo: data[uid].extraInfo || "",
//         approved: data[uid].approved || false,
//       }));

//       // ✅ Filter only approved champs
//       // if (canViewAll) {
//       //   list = list.filter(
//       //     (member) =>
//       //       member.approved === true &&
//       //       member.extraInfo === "champs"
//       //   );
//       // }

//       //pority members to be shown first
//       if (canViewAll) {
//       // Step 1: Filter approved champs
//       list = list.filter(
//         (member) =>
//           member.approved === true &&
//           member.extraInfo === "champs"
//       );

//       // Step 2: Separate priority and others
//       const priorityList = [];
//       const remainingList = [];

//       list.forEach((member) => {
//         const matchIndex = PRIORITY_MEMBERS.findIndex(
//           (p) =>
//             p.name === member.fullname &&
//             p.batch === member.batch
//         );

//         if (matchIndex !== -1) {
//           priorityList[matchIndex] = member; // keep correct order
//         } else {
//           remainingList.push(member);
//         }
//       });

//       // Remove empty slots (in case some priority users not found)
//       const orderedPriority = priorityList.filter(Boolean);

//       // Step 3: Merge priority first + others
//       list = [...orderedPriority, ...remainingList];
//     }


//       setMembers(list);
//     } catch (err) {
//       console.error("Team fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchMembers();
// }, [canViewAll]);


//   if (loading) return <p>Loading members...</p>;

//   return (
//     <div className="team-page">
//       <h2>Team Members</h2>

//       <div className={`team-grid ${!canViewAll ? "blurred" : ""}`}>
//         {members.map((member) => (
//           <div className="team-card" key={member.id}>
//             <img src={member.profileImage} alt={member.fullname} className="team-profile" />
//             <h3 className="team-name">{member.fullname}</h3>
//             {/* Branch • Batch */}
//             {(member.branch || member.batch) && (
//               <p className="team-meta">
//                 {[member.branch, member.batch]
//                   .filter(Boolean)
//                   .join(" • ")}
//               </p>
//             )}

//             {canViewAll && (
//               <>
//                 {/* Profession */}
//                 {member.profession && (
//                   <p className="team-meta">
//                     Profession: {member.profession}
//                   </p>
//                 )}

//                 {/* Location */}
//                 {(member.city || member.state || member.country) && (
//                   <p className="team-meta">
//                     Location: {[member.city, member.state, member.country]
//                       .filter(Boolean)
//                       .join(", ")}
//                   </p>
//                 )}
//               </>
//             )}

//           </div>
//         ))}
//       </div>

//       {!canViewAll && (
//         <div className="team-overlay">
//           <h3>Want to view full team details?</h3>
//           <p>Login / Signup & get approved to unlock full access</p>
//           <button onClick={() => (window.location.href = "/accounts")}>Login / Signup</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Team;
