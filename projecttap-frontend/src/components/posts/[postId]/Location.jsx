import { FiMapPin } from "react-icons/fi";

export default function Location( {post} ) {
  return (<>
    <div className="text-2xl font-semibold mt-10 mb-4 text-black">Location</div>
    <div className="p-4 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
      <div className="flex-shrink-0">
        <FiMapPin className="h-6 w-6 text-indigo-600" />
      </div>
      <div>
        <p className="text-gray-500">{post.location}</p>
      </div>
      {/* Aici ar trebui să înlocuiți cu o componentă de hartă reală */}
      <div className="h-25 w-25 rounded-full bg-blue-100 flex items-center justify-center">
        <span className="text-blue-500"><img src="https://map.viamichelin.com/map/carte?map=viamichelin&z=10&lat=45.64456&lon=25.60111&width=550&height=382&format=png&version=latest&layer=background&debug_pattern=.*"
         alt="" /></span>
      </div>
    </div>
    </>
  );
};
