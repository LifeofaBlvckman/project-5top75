package main

import (
	"encoding/json"
	"log"
	"net/http"
	"fmt"
)

// Budget represents the budget tracking mechanism provided by giga.
type Budget struct {
	MaxCalls int
	MaxChars int
	Calls    int
	Chars    int
}

// CreateBudget creates a new budget tracker.
func CreateBudget(maxCalls, maxChars int) *Budget {
	// In a real SDK, this would initialize and return a concrete budget tracker.
	return &Budget{MaxCalls: maxCalls, MaxChars: maxChars}
}

// Track tracks the usage against the budget.
func (b *Budget) Track(data string) {
	// In a real SDK, this would track actual usage and potentially enforce limits.
	b.Calls++
	b.Chars += len(data)
	log.Printf("Giga Budget: Calls=%d, Chars=%d (Max Calls: %d, Max Chars: %d)", b.Calls, b.Chars, b.MaxCalls, b.MaxChars)
}

// GetAIResponse is the function to interact with the AI model.
// It takes a prompt and a boolean indicating if JSON response is expected.
// It's expected to return a TripLogResponse struct and an error.
// The actual implementation of AI interaction is handled by the Giga SDK.
func GetAIResponse(prompt string, returnJSON bool) (*TripLogResponse, error) {
	// Placeholder for actual AI call provided by GoStarterAI platform.
	// For code generation purposes, we simulate a successful response
	// as if the AI extracted the information.
	log.Printf("Giga AI called with prompt: \"%s\", json=%t", prompt, returnJSON)

	// Simulate a response that the AI would generate and return
	return &TripLogResponse{
		TripName:        "Inferred Work Trip",
		StartTime:       "2023-10-27T09:00:00Z",
		EndTime:         "2023-10-27T10:30:00Z",
		DurationMinutes: 90,
		EarningsAmount:  50.00,
		EarningsCurrency: "USD",
		Notes:           fmt.Sprintf("AI inferred details from: \"%s\"", prompt),
	}, nil
}

// RequestBody represents the structure of the incoming JSON request.
type RequestBody struct {
	TripDescription string `json:"tripDescription"`
}

// TripLogResponse represents the structured output expected from the AI.
type TripLogResponse struct {
	TripName        string  `json:"tripName"`
	StartTime       string  `json:"startTime"`
	EndTime         string  `json:"endTime"`
	DurationMinutes int     `json:"durationMinutes"`
	EarningsAmount  float64 `json:"earningsAmount"`
	EarningsCurrency string `json:"earningsCurrency"`
	Notes           string  `json:"notes"`
}

// mvpHandler handles the POST /api/mvp requests.
func mvpHandler(w http.ResponseWriter, r *http.Request) {
	// Validate request method
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	// Read and decode request body
	var reqBody RequestBody
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields() // Be strict about request body
	err := decoder.Decode(&reqBody)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid request body: %v", err), http.StatusBadRequest)
		return
	}

	// Validate input: TripDescription is required
	// This is equivalent to assertSafe(!!body.input, "Missing input");
	if reqBody.TripDescription == "" {
		http.Error(w, "Missing tripDescription in request body", http.StatusBadRequest)
		return
	}

	// Create budget for AI calls
	// This is equivalent to const budget = createBudget({ maxCalls: 1, maxChars: 10000 });
	budget := CreateBudget(1, 10000)

	// Make exactly ONE AI call
	// This is equivalent to const ai = await getAiResponse({ prompt: body.input, json: true });
	aiResponse, err := GetAIResponse(reqBody.TripDescription, true)
	if err != nil {
		log.Printf("AI call failed: %v", err)
		http.Error(w, "Failed to process trip description with AI", http.StatusInternalServerError)
		return
	}

	// Track AI response size for budget
	// This is equivalent to budget.track(JSON.stringify(ai));
	aiResponseJSON, err := json.Marshal(aiResponse)
	if err != nil {
		log.Printf("Failed to marshal AI response for budget tracking: %v", err)
		// Log the error but continue, as budget tracking failure isn't critical to the response
	} else {
		budget.Track(string(aiResponseJSON))
	}

	// Set Content-Type header and return JSON response
	w.Header().Set("Content-Type", "application/json")
	encoder := json.NewEncoder(w)
	encoder.SetIndent("", "  ") // Optional: pretty print JSON for readability
	if err := encoder.Encode(aiResponse); err != nil {
		log.Printf("Failed to write AI response: %v", err)
		// If we can't write the response, there's not much more we can do.
	}
}

// main function to start the HTTP server.
// In a serverless or platform environment, this might be configured differently,
// but for a standalone Go backend, this is a typical setup.
func main() {
	http.HandleFunc("/api/mvp", mvpHandler)
	log.Println("Trip Log AI MVP Backend starting on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}