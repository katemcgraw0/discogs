import StarRating from 'react-native-star-rating-widget';
import { useEffect, useState } from 'react';
import { supabase } from '../app/lib/supabase-client'



export default function StarRatingCustom({ album, user, collectionOrWishlist }) {
    const [rating, setRating] = useState(0);
    useEffect(() => {

        getCurrentRating();
    }, []);
    async function getCurrentRating(){
        const { data, error } = await supabase
        .from(collectionOrWishlist)
        .select('rating')
        .eq('album_id', album.id)
        .eq('user_id', user.id);
        if (error) {
            console.log(error);
            throw new Error("Error fetching album rating");
        }
        console.log("User album data star rating:", data);
        setRating(data[0].rating || 0);

    }


    async function updateRating(){  
        const { data, error } = await supabase
        .from(collectionOrWishlist)
        .upsert({
            album_id: album.id,
            user_id: user.id,
            rating: rating
        });
        if (error) {
            console.log(error);
            throw new Error("Error updating album rating");
        }
        console.log("User album data:", data);
    }
return(
    <StarRating
        rating={rating}
        onChange={setRating}
        enableHalfStar={false}
        starSize={20}
        color={'#355E3B'}
        onRatingEnd={updateRating}
      />
);
}