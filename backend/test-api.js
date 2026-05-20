/**
 * API Test Script for Job Portal
 * 
 * Run: node test-api.js
 * 
 * Tests MongoDB connection, auth flow, and all major API endpoints.
 * Make sure the backend server is running on PORT 8000 first.
 */

const BASE_URL = "http://localhost:8000/api/v1";
let authCookie = "";
let testUserId = "";
let testCompanyId = "";
let testJobId = "";
let testApplicationId = "";

const TEST_EMAIL = `testuser_${Date.now()}@test.com`;
const TEST_PASSWORD = "test123456";

// Simple fetch wrapper
async function apiCall(method, path, body = null, expectStatus = null) {
    const url = `${BASE_URL}${path}`;
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(authCookie ? { Cookie: authCookie } : {}),
        },
    };
    if (body) options.body = JSON.stringify(body);

    try {
        const res = await fetch(url, options);
        const data = await res.json();

        // Capture auth cookie
        const setCookie = res.headers.get("set-cookie");
        if (setCookie && setCookie.includes("token=")) {
            authCookie = setCookie.split(";")[0];
        }

        return { status: res.status, data };
    } catch (error) {
        return { status: 0, data: { message: error.message, success: false } };
    }
}

function log(icon, test, result) {
    console.log(`  ${icon} ${test}: ${result}`);
}

function pass(test, detail = "") {
    log("✅", test, detail ? `PASS — ${detail}` : "PASS");
}

function fail(test, detail = "") {
    log("❌", test, detail ? `FAIL — ${detail}` : "FAIL");
}

// ========== TEST SUITE ==========

async function testServerHealth() {
    console.log("\n📡 Server Health Check");
    console.log("─".repeat(50));
    try {
        const res = await fetch(`${BASE_URL}/user/logout`);
        if (res.status !== 0) {
            pass("Server is reachable", `Status: ${res.status}`);
        }
    } catch (err) {
        fail("Server is reachable", `Cannot connect to ${BASE_URL}. Is the server running?`);
        process.exit(1);
    }
}

async function testValidations() {
    console.log("\n🔒 Input Validation Tests");
    console.log("─".repeat(50));

    // Test: Register with missing fields
    let r = await apiCall("POST", "/user/register", {});
    if (r.status === 400 && !r.data.success) {
        pass("Register: missing fields rejected", r.data.message);
    } else {
        fail("Register: missing fields rejected", `Got status ${r.status}`);
    }

    // Test: Register with invalid email
    r = await apiCall("POST", "/user/register", {
        fullname: "Test", email: "not-an-email", phoneNumber: "1234567890", password: "123456", role: "student"
    });
    if (r.status === 400 && r.data.message.toLowerCase().includes("email")) {
        pass("Register: invalid email rejected", r.data.message);
    } else {
        fail("Register: invalid email rejected", `Got: ${r.data.message}`);
    }

    // Test: Register with invalid phone
    r = await apiCall("POST", "/user/register", {
        fullname: "Test", email: "test@test.com", phoneNumber: "abc", password: "123456", role: "student"
    });
    if (r.status === 400 && r.data.message.toLowerCase().includes("phone")) {
        pass("Register: invalid phone rejected", r.data.message);
    } else {
        fail("Register: invalid phone rejected", `Got: ${r.data.message}`);
    }

    // Test: Register with short password
    r = await apiCall("POST", "/user/register", {
        fullname: "Test", email: "test@test.com", phoneNumber: "1234567890", password: "123", role: "student"
    });
    if (r.status === 400 && r.data.message.toLowerCase().includes("password")) {
        pass("Register: short password rejected", r.data.message);
    } else {
        fail("Register: short password rejected", `Got: ${r.data.message}`);
    }

    // Test: Register with invalid role
    r = await apiCall("POST", "/user/register", {
        fullname: "Test", email: "test@test.com", phoneNumber: "1234567890", password: "123456", role: "admin"
    });
    if (r.status === 400 && r.data.message.toLowerCase().includes("role")) {
        pass("Register: invalid role rejected", r.data.message);
    } else {
        fail("Register: invalid role rejected", `Got: ${r.data.message}`);
    }

    // Test: Login with missing fields
    r = await apiCall("POST", "/user/login", {});
    if (r.status === 400 && !r.data.success) {
        pass("Login: missing fields rejected", r.data.message);
    } else {
        fail("Login: missing fields rejected", `Got status ${r.status}`);
    }

    // Test: Login with invalid email format
    r = await apiCall("POST", "/user/login", { email: "bad", password: "123456", role: "student" });
    if (r.status === 400) {
        pass("Login: invalid email rejected", r.data.message);
    } else {
        fail("Login: invalid email rejected", `Got status ${r.status}`);
    }

    // Test: Get job with invalid ID
    r = await apiCall("GET", "/job/get/invalidid123");
    if (r.status === 400 && r.data.message.toLowerCase().includes("invalid")) {
        pass("Job: invalid ID format rejected", r.data.message);
    } else {
        fail("Job: invalid ID format rejected", `Got: ${r.data.message}`);
    }
}

async function testAuthFlow() {
    console.log("\n🔐 Authentication Flow Tests");
    console.log("─".repeat(50));

    // Register as recruiter (needed to create companies/jobs later)
    let r = await apiCall("POST", "/user/register", {
        fullname: "Test Recruiter",
        email: TEST_EMAIL,
        phoneNumber: "9876543210",
        password: TEST_PASSWORD,
        role: "recruiter"
    });
    if (r.status === 201 && r.data.success) {
        pass("Register recruiter", r.data.message);
    } else {
        fail("Register recruiter", `${r.status}: ${r.data.message}`);
        return false;
    }

    // Duplicate registration
    r = await apiCall("POST", "/user/register", {
        fullname: "Test Recruiter",
        email: TEST_EMAIL,
        phoneNumber: "9876543210",
        password: TEST_PASSWORD,
        role: "recruiter"
    });
    if (r.status === 400 && r.data.message.toLowerCase().includes("already")) {
        pass("Duplicate register blocked", r.data.message);
    } else {
        fail("Duplicate register blocked", `${r.status}: ${r.data.message}`);
    }

    // Login
    r = await apiCall("POST", "/user/login", {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        role: "recruiter"
    });
    if (r.status === 200 && r.data.success && authCookie) {
        testUserId = r.data.user._id;
        pass("Login", `Welcome ${r.data.user.fullname}, cookie set`);
    } else {
        fail("Login", `${r.status}: ${r.data.message}`);
        return false;
    }

    // Wrong role login
    r = await apiCall("POST", "/user/login", {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        role: "student"
    });
    if (r.status === 400) {
        pass("Wrong role login blocked", r.data.message);
    } else {
        fail("Wrong role login blocked", `${r.status}: ${r.data.message}`);
    }

    // Wrong password login
    r = await apiCall("POST", "/user/login", {
        email: TEST_EMAIL,
        password: "wrongpassword",
        role: "recruiter"
    });
    if (r.status === 400) {
        pass("Wrong password blocked", r.data.message);
    } else {
        fail("Wrong password blocked", `${r.status}: ${r.data.message}`);
    }

    // Access protected route without token
    const savedCookie = authCookie;
    authCookie = "";
    r = await apiCall("GET", "/company/get");
    if (r.status === 401) {
        pass("Protected route without token → 401", r.data.message);
    } else {
        fail("Protected route without token → 401", `Got status ${r.status}`);
    }
    authCookie = savedCookie;

    return true;
}

async function testCompanyAPIs() {
    console.log("\n🏢 Company API Tests");
    console.log("─".repeat(50));

    // Register company - missing name
    let r = await apiCall("POST", "/company/register", {});
    if (r.status === 400) {
        pass("Register company: missing name rejected", r.data.message);
    } else {
        fail("Register company: missing name rejected", `${r.status}: ${r.data.message}`);
    }

    // Register company
    const companyName = `TestCompany_${Date.now()}`;
    r = await apiCall("POST", "/company/register", { companyName });
    if (r.status === 201 && r.data.success) {
        testCompanyId = r.data.company._id;
        pass("Register company", `ID: ${testCompanyId}`);
    } else {
        fail("Register company", `${r.status}: ${r.data.message}`);
        return false;
    }

    // Duplicate company
    r = await apiCall("POST", "/company/register", { companyName });
    if (r.status === 400) {
        pass("Duplicate company blocked", r.data.message);
    } else {
        fail("Duplicate company blocked", `${r.status}: ${r.data.message}`);
    }

    // Get all companies
    r = await apiCall("GET", "/company/get");
    if (r.status === 200 && r.data.success && r.data.companies.length > 0) {
        pass("Get all companies", `Found ${r.data.companies.length} company(ies)`);
    } else {
        fail("Get all companies", `${r.status}: ${r.data.message}`);
    }

    // Get company by ID
    r = await apiCall("GET", `/company/get/${testCompanyId}`);
    if (r.status === 200 && r.data.success) {
        pass("Get company by ID", `Name: ${r.data.company.name}`);
    } else {
        fail("Get company by ID", `${r.status}: ${r.data.message}`);
    }

    // Get company with invalid ID
    r = await apiCall("GET", "/company/get/invalidid");
    if (r.status === 400) {
        pass("Get company: invalid ID rejected", r.data.message);
    } else {
        fail("Get company: invalid ID rejected", `${r.status}`);
    }

    return true;
}

async function testJobAPIs() {
    console.log("\n💼 Job API Tests");
    console.log("─".repeat(50));

    // Post job - missing fields
    let r = await apiCall("POST", "/job/post", {});
    if (r.status === 400) {
        pass("Post job: missing fields rejected", r.data.message);
    } else {
        fail("Post job: missing fields rejected", `${r.status}`);
    }

    // Post job - invalid salary
    r = await apiCall("POST", "/job/post", {
        title: "Test", description: "Test description here", requirements: "JS,React",
        salary: "abc", location: "Bangalore", jobType: "Full-time",
        experience: "2", position: "1", companyId: testCompanyId
    });
    if (r.status === 400 && r.data.message.toLowerCase().includes("salary")) {
        pass("Post job: invalid salary rejected", r.data.message);
    } else {
        fail("Post job: invalid salary rejected", `${r.status}: ${r.data.message}`);
    }

    // Post job - invalid companyId
    r = await apiCall("POST", "/job/post", {
        title: "Test", description: "Test description here", requirements: "JS,React",
        salary: "10", location: "Bangalore", jobType: "Full-time",
        experience: "2", position: "1", companyId: "invalidid"
    });
    if (r.status === 400 && r.data.message.toLowerCase().includes("company")) {
        pass("Post job: invalid companyId rejected", r.data.message);
    } else {
        fail("Post job: invalid companyId rejected", `${r.status}: ${r.data.message}`);
    }

    // Post job - success
    r = await apiCall("POST", "/job/post", {
        title: "React Developer",
        description: "We are looking for a skilled React developer to join our team.",
        requirements: "React,JavaScript,TypeScript,CSS",
        salary: "12",
        location: "Bangalore",
        jobType: "Full-time",
        experience: "2",
        position: "3",
        companyId: testCompanyId
    });
    if (r.status === 201 && r.data.success) {
        testJobId = r.data.job._id;
        pass("Post job", `ID: ${testJobId}`);
    } else {
        fail("Post job", `${r.status}: ${r.data.message}`);
        return false;
    }

    // Get all jobs (no filters)
    r = await apiCall("GET", "/job/get");
    if (r.status === 200 && r.data.success && r.data.pagination) {
        pass("Get all jobs", `Found ${r.data.pagination.totalJobs} job(s), Page ${r.data.pagination.currentPage}/${r.data.pagination.totalPages}`);
    } else {
        fail("Get all jobs", `${r.status}: ${r.data.message}`);
    }

    // Get jobs with filters
    r = await apiCall("GET", "/job/get?keyword=React&location=Bangalore&sortBy=salary&sortOrder=desc");
    if (r.status === 200 && r.data.success) {
        pass("Get jobs with filters", `Found ${r.data.jobs.length} job(s) matching 'React' in 'Bangalore'`);
    } else {
        fail("Get jobs with filters", `${r.status}: ${r.data.message}`);
    }

    // Get jobs with salary range
    r = await apiCall("GET", "/job/get?salaryMin=10&salaryMax=20");
    if (r.status === 200 && r.data.success) {
        pass("Get jobs with salary range", `Found ${r.data.jobs.length} job(s) in 10-20 LPA range`);
    } else {
        fail("Get jobs with salary range", `${r.status}: ${r.data.message}`);
    }

    // Invalid salary range
    r = await apiCall("GET", "/job/get?salaryMin=20&salaryMax=5");
    if (r.status === 400) {
        pass("Invalid salary range rejected", r.data.message);
    } else {
        fail("Invalid salary range rejected", `${r.status}`);
    }

    // Get job by ID
    r = await apiCall("GET", `/job/get/${testJobId}`);
    if (r.status === 200 && r.data.success) {
        pass("Get job by ID", `Title: ${r.data.job.title}`);
    } else {
        fail("Get job by ID", `${r.status}: ${r.data.message}`);
    }

    // Get admin jobs
    r = await apiCall("GET", "/job/getadminjobs");
    if (r.status === 200 && r.data.success) {
        pass("Get admin jobs", `Found ${r.data.jobs.length} admin job(s)`);
    } else {
        fail("Get admin jobs", `${r.status}: ${r.data.message}`);
    }

    return true;
}

async function testApplicationAPIs() {
    console.log("\n📋 Application API Tests");
    console.log("─".repeat(50));

    // Apply for job
    let r = await apiCall("POST", `/application/apply/${testJobId}`);
    if (r.status === 201 && r.data.success) {
        pass("Apply for job", r.data.message);
    } else {
        fail("Apply for job", `${r.status}: ${r.data.message}`);
    }

    // Duplicate application
    r = await apiCall("POST", `/application/apply/${testJobId}`);
    if (r.status === 400 && r.data.message.toLowerCase().includes("already")) {
        pass("Duplicate application blocked", r.data.message);
    } else {
        fail("Duplicate application blocked", `${r.status}: ${r.data.message}`);
    }

    // Apply with invalid job ID
    r = await apiCall("POST", "/application/apply/invalidid");
    if (r.status === 400) {
        pass("Apply: invalid job ID rejected", r.data.message);
    } else {
        fail("Apply: invalid job ID rejected", `${r.status}`);
    }

    // Get applied jobs
    r = await apiCall("GET", "/application/get");
    if (r.status === 200 && r.data.success) {
        pass("Get applied jobs", `Found ${r.data.application.length} application(s)`);
    } else {
        fail("Get applied jobs", `${r.status}: ${r.data.message}`);
    }

    // Get applicants for a job
    r = await apiCall("GET", `/application/${testJobId}/applicants`);
    if (r.status === 200 && r.data.success) {
        const count = r.data.job.applications ? r.data.job.applications.length : 0;
        pass("Get applicants", `Found ${count} applicant(s)`);

        // Get application ID for status update test
        if (r.data.job.applications && r.data.job.applications.length > 0) {
            testApplicationId = r.data.job.applications[0]._id;
        }
    } else {
        fail("Get applicants", `${r.status}: ${r.data.message}`);
    }

    // Update status - invalid status
    if (testApplicationId) {
        r = await apiCall("POST", `/application/status/${testApplicationId}/update`, { status: "invalid" });
        if (r.status === 400) {
            pass("Update status: invalid status rejected", r.data.message);
        } else {
            fail("Update status: invalid status rejected", `${r.status}`);
        }

        // Update status - success
        r = await apiCall("POST", `/application/status/${testApplicationId}/update`, { status: "Accepted" });
        if (r.status === 200 && r.data.success) {
            pass("Update status to Accepted", r.data.message);
        } else {
            fail("Update status to Accepted", `${r.status}: ${r.data.message}`);
        }
    }
}

async function testLogout() {
    console.log("\n🚪 Logout Test");
    console.log("─".repeat(50));

    const r = await apiCall("GET", "/user/logout");
    if (r.status === 200 && r.data.success) {
        pass("Logout", r.data.message);
    } else {
        fail("Logout", `${r.status}: ${r.data.message}`);
    }
}

// ========== RUN ALL TESTS ==========

async function runTests() {
    console.log("╔══════════════════════════════════════════════════╗");
    console.log("║     🧪 Job Portal API Test Suite                 ║");
    console.log("╚══════════════════════════════════════════════════╝");

    await testServerHealth();
    await testValidations();
    const authOk = await testAuthFlow();
    
    if (authOk) {
        const companyOk = await testCompanyAPIs();
        if (companyOk) {
            const jobOk = await testJobAPIs();
            if (jobOk) {
                await testApplicationAPIs();
            }
        }
        await testLogout();
    }

    console.log("\n" + "═".repeat(50));
    console.log("🏁 Test suite complete!");
    console.log("═".repeat(50));
}

runTests().catch(console.error);
