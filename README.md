# Kubernetes Workflow and Pods – Common Errors

## Pod Creation & Communication Flow

Below is a step-by-step breakdown of how Kubernetes components interact during pod creation:

1. **User Request**
   A user (or automated process) uses a client like `kubectl` to send a request to the API Server.
   Example:

   ```bash
   kubectl apply -f pod.yaml
   ```

   This request defines the desired state of the pod.

2. **API Server – Authentication & Validation**
   The API Server acts as the cluster’s front door. It authenticates, authorizes, and validates the request to ensure it follows Kubernetes rules.

3. **State Storage in etcd**
   After validation, the API Server stores the pod’s desired state in **etcd**, the distributed key-value store and single source of truth. The API Server then responds back to the client (e.g., *pod created*).

4. **Scheduler’s Role**
   The Scheduler continuously watches the API Server for unscheduled pods. It selects the best worker node based on:

   * CPU and memory requirements
   * Node constraints
   * Scheduling policies

5. **API Server Updates etcd (Binding)**
   The Scheduler sends its decision to the API Server, which updates etcd by binding the pod to the selected node.

6. **Kubelet’s Role**
   The Kubelet, running on the chosen worker node, watches the API Server for pods assigned to its node and starts the pod creation process.

7. **Container Creation**
   The Kubelet communicates with the container runtime (e.g., containerd) to:

   * Pull container images (if not already present)
   * Start containers as defined in the pod spec

8. **Networking Configuration**
   The Kubelet works with the CNI plugin and kube-proxy to:

   * Assign a unique IP address to the pod
   * Configure networking rules (iptables/IPVS)
   * Enable communication with other pods and services

9. **Status Reporting**
   The Kubelet monitors pod health and reports status (Running, Ready, etc.) back to the API Server, which updates etcd.

10. **Controller Manager (Ongoing Management)**
    Controllers (Deployment, ReplicaSet, etc.) continuously compare desired state vs actual state and take corrective action if pods fail or replicas are missing.

---

## Overview of Pod Errors

Pod errors in Kubernetes usually occur due to:

* Image pull failures
* Application crashes
* Resource constraints
* Configuration issues
* Scheduling problems

Diagnosis is typically done using:

* `kubectl describe pod`
* `kubectl logs`

---

## Common Pod Errors & Solutions

### 1. ImagePullBackOff / ErrImagePull

**Description:** Kubernetes cannot pull the container image.

**Fix:**

* Verify image name and tag
* Ensure image exists in the registry
* Check `imagePullSecrets` for private registries

---

### 2. CrashLoopBackOff

**Description:** Container repeatedly starts and crashes.

**Fix:**

* Check logs:

  ```bash
  kubectl logs <pod-name>
  ```
* Look for application errors or missing files
* Verify resource limits to avoid OOMKills

---

### 3. Pending (Stuck)

**Description:** Pod is not scheduled on any node.

**Fix:**

* Describe the pod to inspect scheduling events:

  ```bash
  kubectl describe pod <pod-name>
  ```
* Check for insufficient CPU/memory
* Verify taints, tolerations, and affinity rules

---

### 4. OOMKilled (Out Of Memory)

**Description:** Container exceeds its memory limit and is killed.

**Fix:**

* Increase memory limits in pod spec
* Optimize application memory usage

---

### 5. Liveness Probe Failure

**Description:** Application fails health checks.

**Fix:**

* Validate probe endpoint
* Increase initial delay or timeout
* Ensure the application starts correctly

---

### 6. DNS Issues

**Description:** Pod cannot resolve hostnames.

**Fix:**

* Check CoreDNS status
* Validate CNI configuration
* Inspect pod DNS settings

---

## Most Common Kubernetes Pod Errors

The most frequent pod issues include:

* **CrashLoopBackOff**
* **ImagePullBackOff**
* **OOMKilled**
* **Pending**

These are typically related to container execution, image retrieval, resource allocation, and configuration mistakes.

---

## Pod Errors and Their Primary Causes

### CrashLoopBackOff

Occurs when a container repeatedly crashes.

**Common Causes:**

* Application bugs
* Incorrect entrypoint or command
* Missing environment variables or config files
* Insufficient memory limits
* Failed liveness probes

---

### ImagePullBackOff / ErrImagePull

Occurs when Kubernetes cannot retrieve the image.

**Common Causes:**

* Incorrect image name or tag
* Image does not exist
* Missing registry authentication (`imagePullSecrets`)
* Network connectivity issues

---

### OOMKilled

Occurs when a container exceeds its memory limit.

**Common Causes:**

* Memory leaks
* Memory limits set too low

---

### Pending

Pod cannot be scheduled.

**Common Causes:**

* Insufficient cluster resources
* Incorrect node selectors or affinity rules
* Node taints without tolerations

---

### CreateContainerConfigError

Kubernetes fails to create container configuration.

**Common Causes:**

* Missing ConfigMaps or Secrets
* Invalid volume mounts
* Referencing non-existent keys

---

### ContainerCannotRun / CreateContainerError

Container fails during startup.

**Common Causes:**

* Invalid commands or arguments
* Missing executables in the image
* Volume permission issues

---

### NodeNotReady

Node is unhealthy.

**Common Causes:**

* Node resource pressure
* Disk or network issues
* Control plane communication failures

---

### FailedScheduling

Scheduler cannot find a suitable node.

**Common Causes:**

* Resource constraints
* Conflicts with taints, tolerations, or affinity rules

---

## General Troubleshooting Steps

A systematic approach using `kubectl` is essential:

1. **Check Pod Status**

   ```bash
   kubectl get pods
   ```

2. **Inspect Pod Details**

   ```bash
   kubectl describe pod <pod-name>
   ```

   Review the **Events** section carefully.

3. **Review Logs**

   ```bash
   kubectl logs <pod-name>
   kubectl logs --previous <pod-name>
   ```

4. **Validate Configuration**

   * Check YAML syntax
   * Verify image names
   * Confirm resource limits
   * Ensure referenced ConfigMaps, Secrets, and PVCs exist

5. **Exec Into the Pod (If Running)**

   ```bash
   kubectl exec -it <pod-name> -- /bin/sh
   ```

   Use this to debug from inside the container.
