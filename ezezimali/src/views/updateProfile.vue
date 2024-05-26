<template>
    <main class="container">
        <h2 class="text-2xl font-semibold mb-6 text-gray-800">Update Profile</h2>
        <form @submit.prevent="updateProfile" class="form-container">
            <section class="mb-4">
                <label for="username" class="block text-gray-700 font-bold mb-2">Username</label>
                <input type="text" id="username" v-model="formData.username"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required />
            </section>
            <section class="mb-4">
                <label for="profilePic" class="block text-gray-700 font-bold mb-2">Profile Picture</label>
                <section @click="openUploadWidget" class="flexRow uploadbtn">
                    <img src="https://www.svgrepo.com/show/485545/upload-cicle.svg" alt="file upload icon" width="30"
                        height="30">
                    <article>
                        <section class="block text-base font-semibold relative text-blue-900 group-hover:text-blue-500">
                            Upload a file
                        </section>
                        <section class="mt-0.5 block text-sm text-gray-500">Max 10 MB</section>
                    </article>
                </section>

            </section>
            <button type="submit" class="submit-button">
                Update Profile
            </button>
        </form>
    </main>
</template>

<script>

import { mapGetters } from 'vuex';
import { baseurl } from '../config/config';
import axios from 'axios';

import toast from '../components/toasty';

export default {
    data() {
        return {
            formData: {
                username: '',
                profilePic: ''
            }
        };
    },
    async mounted() {
        this.formData.username = await this.getUser.username;
        this.formData.profilePic = await this.getUser.profile_pic;

        // console.log(this.getUser.profile_pic);
    },
    computed: {
        ...mapGetters([
            'getUser', 'getUserType'
        ]),
    },
    methods: {
        openUploadWidget() {
            const widget = window.cloudinary.createUploadWidget(
                {
                    cloud_name: 'djid7mzda',
                    upload_preset: 'upload-demo',
                    sources: ['local', 'url', 'dropbox', 'google_drive', 'facebook', 'instagram'],
                    resource_type: 'image',
                    client_allowed_formats: ['jpg', 'png', 'jpeg'],
                    cropping: true, // Enable cropping
                    cropping_aspect_ratio: 1, // Force 1:1 aspect ratio
                    cropping_default_selection_ratio: 1, // Default selection ratio
                    cropping_show_dimensions: true,
                    max_file_size: 10485760 // Optional: restrict file size (10 MB in this example)
                },
                (error, result) => {
                    if (!error && result && result.event === 'success') {
                        this.formData.profilePic = result.info.url;
                        console.log('Profile picture uploaded: ', result.info);
                    } else {
                        console.log(error);
                    }
                }
            );
            widget.open();
        },
        async updateProfile() {

            // console.log(id, index);


            const token = await this.getUser.token;
            const id = await this.getUser.id;
            const username = await this.getUser.username;


            axios.put(baseurl + '/api/v1/user/profile', {
                "id": id,
                "username": this.formData.username,
                "profile_pic": this.formData.profilePic,
            }, {
                headers: {
                    'Authorization': `${token}`
                }
            }).then(response => {
                const data = response.data;

                if (data.message === 'Success') {
                    toast.success(username + ' has been updated.');

                    this.getUser.profile_pic = this.formData.profilePic;

                    this.getUser.username = this.formData.username;

                } else if (data.message === 'Failure') {
                    toast.warning(username+ ' could not be updated.');
                } else {
                    toast.error(username + ' could not be updated.');
                }
            }).catch(error => {
                if (error.response && error.response.status === 401) {
                    toast.error('Unauthorized access - please log in again');
                    console.error('Unauthorized access - please log in again');
                } else {
                    const errorMessage = error.response ? error.response.data.message : error.message;
                    toast.error(`Request failed: ${errorMessage}`);
                    console.error(error);
                }
            });
        },
    }
};
</script>

<style scoped>
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    margin-top: 5rem;
    justify-content: start;
    height: 60vh;

}

.submit-button {
    margin-right: 10px;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    width: 100%;
    margin-top: 2rem;
    background-color: rgb(40, 122, 255);
}

input {
    margin-bottom: 1rem;
}


.submit-button:hover {
    transform: scale(1.02);
    transition: transform 0.3s;
}

.form-container {
    width: 100%;
    background: #f6f7f8;
    padding: 2rem;
    border-radius: 0.5rem;
    max-width: 500px;
    gap: 2rem;
}

.submit-button:hover {
    background-color: rgb(23, 95, 211);
}

.uploadbtn {
    cursor: pointer;
    background: #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: start;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #f2f2f2;
    gap: 10px;

}

.uploadbtn:hover {
    background-color: #d7d7d7;

}

@media (max-width: 450px) {
    .form-container {
        max-width: 350px;
    }
}
</style>