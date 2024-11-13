<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import certificationService from './certificationService';

const router = useRouter();
const isValid = ref(false);
const editMode = ref(false);
const certifications = ref([]);

// Assuming resumeId is stored in localStorage or Vuex
const resumeId = localStorage.getItem('currentResumeId');

const certification = ref({
  title: '',
  organization: '',
  date: '',
  resumeId: resumeId
});

// Fetch certifications on component mount
onMounted(async () => {
  try {
    const response = await certificationService.getCertificationsForResume(resumeId);
    certifications.value = response.data;
  } catch (error) {
    console.error('Error fetching certifications:', error);
  }
});

const saveCertification = async () => {
  try {
    if (editMode.value) {
      await certificationService.updateCertification(certification.value.id, certification.value);
    } else {
      await certificationService.createCertification(certification.value);
    }
    
    // Refresh the list
    const response = await certificationService.getCertificationsForResume(resumeId);
    certifications.value = response.data;
    
    resetForm();
  } catch (error) {
    console.error('Error saving certification:', error);
  }
};

const editCertification = (cert) => {
  editMode.value = true;
  certification.value = { ...cert };
};

const deleteCertification = async (id) => {
  try {
    await certificationService.deleteCertification(id);
    certifications.value = certifications.value.filter(cert => cert.id !== id);
  } catch (error) {
    console.error('Error deleting certification:', error);
  }
};

const resetForm = () => {
  certification.value = {
    title: '',
    organization: '',
    date: '',
    resumeId: resumeId
  };
  editMode.value = false;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};

const navigateTo = (route) => {
  router.push({ name: route });
};
</script>