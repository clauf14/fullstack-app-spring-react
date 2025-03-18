import { useMemo } from "react";

export default function ShowProfilePicture({ user }) {
    // Determine if the user has a profile picture
    const photoUrl = useMemo(() => 
        user.photo_id 
            ? `http://localhost:8080/photos/display/${user.photo_id}`
            : `http://localhost:8080/photos/display/144`,
            [user.photo_id]
    );

    return (
        <div className="h-14 w-14 rounded-full bg-gray-300">
            <img
                src={photoUrl}
                className="h-full w-full rounded-full object-cover"
                alt={user.photo_id ? "User's Profile Picture" : "Default Profile Picture"}
            />
        </div>
    );
}
