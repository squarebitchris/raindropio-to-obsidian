
// create stateless component
// const RaindropCard = (props: any) => {
//     const { title, description, image, link } = props;

//     return (
//         <div className="raindrop-card">
//             <div className="raindrop-card-image">
//                 <img src={image} alt={title} />
//             </div>
//             <div className="raindrop-card-content">
//                 <div className="raindrop-card-title">{title}</div>
//                 <div className="raindrop-card-description">{description}</div>
//                 <div className="raindrop-card-link">
//                     <a href={link}>Read more</a>
//                 </div>
//             </div>
//         </div>
//     );
// }

// import * as React from "react";

// const mystyle = {
//     card:  {
//       boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
//       backgroundColor: "white",
//       color: "black",
//       padding: "12px 16px",
//       transition: "0.3s",
//       borderRadius: "5px", /* 5px rounded corners */
//       fontSize: "10px",
//     }
//   };




// const StatelessComponent = props => {
//    console.log(props);
//    return (
//       <div>{props.whatever}</div>
//    )
// }

//  function RaindropCard({ raindrop, createRaindropNote, archiveRaindrop }) {
//   return (
//     <div style={{padding: "3px"}}>
//       <div style={mystyle.card}>
//         <p>
//           <img src={raindrop.cover} width="100" height="100" alt="Image" style={{ float: "left", marginRight: "10px" }} /> 
//           {raindrop.title}
//         </p>
//         <p> - {raindrop.excerpt}</p>
//         <p>Check out <a href={raindrop.link} target="_blank">link</a>.</p>
//         <p>Tags: </p>
//         {raindrop.tags.map((tag) => <span>- [[{tag}]] -</span>)}
//        <p>
//         <button onClick={() => createRaindropNote(raindrop)}>
//           Create Raindrop ....
//         </button> 
//         <button onClick={() => archiveRaindrop(raindrop)}>
//           Archive Raindrop ....
//         </button> 
//       </p>
//       </div>
//     </div>
//   );
// }


