<script setup>
import { ref, onMounted } from "vue";
import AdminRequestServices from "../services/AdminRequestServices.js";
import moment from "moment";
import CloseModal from "../components/CloseModal.vue";
import router from "../router";
import ResumeServices from '../services/ResumeServices';

// Holds all open requests with their associated Student
const openRequests = ref([]);
const unfilteredClosedRequests = ref([]);
const closedRequests = ref([]);
const openReqBool = ref(false);
const closedReqBool = ref(false);
const closeModal = ref(false);
const selectedRequest = ref(null);
const showFilterMenu = ref(false);

const userNameFilter = ref(null);
let requestData = ref(null);
const reviewRequests = ref([]);

onMounted(async () => {
  await loadRequests();
  fetchReviewRequests();
});

const loadRequests = async () => {
  try {
    getOpenRequests();
    await getClosedRequests();
    filterClosedRequests();
  } catch (error) {
    console.error(error);
  }
};

const getOpenRequests = async () => {
  const response = await AdminRequestServices.getAllForStatus("Open");
  openRequests.value = response.data;
  openReqBool.value = response.data.length > 0;
};

const getClosedRequests = async () => {
  const response = await AdminRequestServices.getAllForStatus("Closed");
  closedRequests.value = response.data;
  unfilteredClosedRequests.value = response.data;
  closedReqBool.value = response.data.length > 0;
};

const filterClosedRequests = () => {
  closedReqBool.value = true;

  const filteredReqs = unfilteredClosedRequests.value.filter((request) => {
    let inFilter = true;
    if (
      userNameFilter.value &&
      !(request.user.firstName + " " + request.user.lastName)
        .toLowerCase()
        .includes(userNameFilter.value.toLowerCase())
    ) {
      inFilter = false;
    }
    return inFilter;
  });
  closedRequests.value = filteredReqs;
  showFilterMenu.value = false;

  if (filteredReqs.length < 1) {
    closedReqBool.value = false;
  }
};

const clearFilters = () => {
  userNameFilter.value = null;
  closedRequests.value = unfilteredClosedRequests.value;
  showFilterMenu.value = false;
  closedReqBool.value = true;
};

const formatDate = (date) => {
  return moment(String(date)).format("MM/DD/YYYY");
};

const addComment = (request) => {
  router.push({ name: "AddComment", params: { id: request.requestId } });
};

const closeRequest = (request) => {
  const updatedRequest = {
    requestId: request.requestId,
    dateMade: request.dateMade,
    approvedBy: null,
    status: "Closed",
    userId: request.userId,
    notes: request.notes
  };

  AdminRequestServices.update(updatedRequest.requestId, updatedRequest)
    .then(() => {
      loadRequests();
    })
    .catch((e) => {
      console.log("Close failed");
      console.log(e.response.data.message);
    });
  selectedRequest.value = null;
  closeModal.value = false;
};

const fetchReviewRequests = async () => {
  try {
    const response = await ResumeServices.getReviewRequests();
    reviewRequests.value = response.data;
  } catch (error) {
    console.error('Error fetching review requests:', error);
  }
};
</script>

<template>
  <v-container @click.stop>
    <h1>Open Requests</h1>
    <v-table v-if="openReqBool" fixed-header height="20%">
      <thead>
        <tr>
          <th>Name</th>
          <th>User ID</th>
          <th>Notes</th>
          <th>Date Opened</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="request in openRequests" :key="request.userId">
          <td>{{ `${request.user.firstName} ${request.user.lastName}` }}</td>
          <td>{{ request.userId }}</td>
          <td>{{ request.notes }}</td>
          <td>{{ formatDate(request.dateMade) }}</td>
          <td>
            <v-btn color="button_blue" @click="addAccom(request)">
              Review Resume
            </v-btn>
            <v-btn
              flat
              color="primary"
              @click="(closeModal = true), (selectedRequest = request)"
            >
              Close
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <!--If no open requests, display this v-card-->
    <v-card v-else color="silver" class="pa-4 mt-2">
      <p>No open requests.</p>
    </v-card>
    <br />
    <v-divider></v-divider>
    <br />
    <v-row no-gutters>
      <h1>Closed Requests</h1>
      <v-menu v-model="showFilterMenu" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
            size="medium"
            class="font-weight-semi-bold bg-button_blue ml-6 px-2 my-1 mainCardBorder text-none"
            v-bind="props"
          >
            <template v-slot:append>
              <v-icon
                :icon="showFilterMenu ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              ></v-icon>
            </template>
            Filters
          </v-btn>
        </template>

        <v-card min-width="300" class="mainCardBorder mt-2">
          <v-card-text>
            <v-list class="pa-0 ma-0">
              <v-list-item class="pa-0 font-weight-semi-bold text-darkBlue">
                User Name
                <v-text-field
                  color="darkBlue"
                  variant="underlined"
                  class="pt-0 mt-0"
                  v-model="userNameFilter"
                ></v-text-field>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <v-btn
              @click="filterClosedRequests(), (showFilterMenu = false)"
              class="bg-button_blue text-white font-weight-bold text-none innerCardBorder"
            >
              Apply Filters
            </v-btn>
            <v-btn
              v-if="userNameFilter"
              @click="clearFilters"
              class="bg-primary ml-auto text-white font-weight-bold text-none innerCardBorder"
            >
              Clear Filters
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-row>

    <v-table v-if="closedReqBool" fixed-header height="20%">
      <thead>
        <tr>
          <th>Name</th>
          <th>User ID</th>
          <th>Notes</th>
          <th>Date Opened</th>
          <th>Reviewed By</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="request in closedRequests" :key="request.id">
          <td>{{ `${request.user.firstName} ${request.user.lastName}` }}</td>
          <td>{{ request.userId }}</td>
          <td>{{ request.notes }}</td>
          <td>{{ formatDate(request.dateMade) }}</td>
          <td>{{ request.approvedBy }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-card v-else color="silver" class="pa-4 mt-2">
      <p>
        No closed requests{{
          userNameFilter
            ? " for the current filter selection"
            : ""
        }}.
      </p>
    </v-card>
  </v-container>

  <!--Dialog box-->
  <v-dialog v-model="closeModal" width="auto">
    <CloseModal
      :selectedRequest="selectedRequest"
      @handleClose="closeRequest(selectedRequest)"
      @cancel="(closeModal = false), (selectedRequest = null)"
    />
  </v-dialog>
</template>
<style></style>
