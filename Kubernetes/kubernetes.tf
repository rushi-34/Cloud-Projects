provider "google" {
  project     = "kubernetes-417923"
  region      = "us-central1"
}

resource "google_container_cluster" "primary" {
  name               = "k8s-cluster"
  location           = "us-central1-c"
  remove_default_node_pool = true
	initial_node_count       = 1
}

resource "google_container_node_pool" "primary_nodes" {
		name = "default-pool"
		location = "us-central1-c"
		cluster = google_container_cluster.primary.name
		node_count = 1

  node_config {
      machine_type = "e2-medium"
      disk_size_gb = 10
      disk_type    = "pd-standard"
      image_type   = "COS_CONTAINERD"
   }
  
}