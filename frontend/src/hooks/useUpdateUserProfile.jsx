import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateUserProfile = () =>{
    const queryClient = useQueryClient();

    const { mutateAsync : updateProfile , isPending : isUpdatingProfile} = useMutation({
		mutationFn : async (formData) =>{
			try{
				const res = await fetch(`/api/users/update`,{
					method :"POST",
					headers : {
						"content-Type" : "application/json",
					},
					body : JSON.stringify(formData),
				})
				const data = await res.json();
				if(!res.ok){
					throw new Error (data.error || "somting")
				}
				return data;
			}
			catch(error){
				throw new Error (data.error || "somting")
			}
		},
		onSuccess:() =>{
			toast.success("profile updated successfully");
			Promise.all([
				queryClient.invalidateQueries({ queryKey : ["authUser"]}),
				queryClient.invalidateQueries({ queryKey : ["userProfile"]})
			])
		},
		onError:() =>{
			toast.error("enter the correct field");
		}
	})

    return {updateProfile , isUpdatingProfile}
}

export default useUpdateUserProfile;