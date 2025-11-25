#!/usr/bin/env python3
"""
Test script for the HR Interview Transcription API
Run this after starting the server to test all endpoints
"""

import requests
import json
import time
import os

BASE_URL = "http://localhost:8000/api"

def test_health():
    """Test health endpoint"""
    print("Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Health check: {response.status_code} - {response.json()}")
    return response.status_code == 200

def test_stats():
    """Test stats endpoint"""
    print("\nTesting stats endpoint...")
    response = requests.get(f"{BASE_URL}/stats")
    print(f"Stats: {response.status_code} - {response.json()}")
    return response.status_code == 200

def test_upload():
    """Test file upload (simulated)"""
    print("\nTesting file upload...")
    
    # Create a dummy file for testing
    test_file_content = b"dummy audio content"
    files = {"file": ("test_audio.mp3", test_file_content, "audio/mpeg")}
    
    response = requests.post(f"{BASE_URL}/interviews/upload", files=files)
    print(f"Upload: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Uploaded interview ID: {data['id']}")
        return data['id']
    else:
        print(f"Upload failed: {response.text}")
        return None

def test_list_interviews():
    """Test listing interviews"""
    print("\nTesting list interviews...")
    response = requests.get(f"{BASE_URL}/interviews")
    print(f"List interviews: {response.status_code}")
    
    if response.status_code == 200:
        interviews = response.json()
        print(f"Found {len(interviews)} interviews")
        return interviews[0]['id'] if interviews else None
    return None

def test_get_interview(interview_id):
    """Test getting interview details"""
    print(f"\nTesting get interview {interview_id}...")
    response = requests.get(f"{BASE_URL}/interviews/{interview_id}")
    print(f"Get interview: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Interview status: {data['status']}")
        return True
    return False

def test_transcribe(interview_id):
    """Test transcription"""
    print(f"\nTesting transcription for {interview_id}...")
    response = requests.post(f"{BASE_URL}/interviews/{interview_id}/transcribe")
    print(f"Start transcription: {response.status_code}")
    
    if response.status_code == 200:
        # Wait for processing
        print("Waiting for transcription to complete...")
        for i in range(10):
            time.sleep(1)
            status_response = requests.get(f"{BASE_URL}/interviews/{interview_id}/status")
            if status_response.status_code == 200:
                status = status_response.json()['status']
                print(f"Status: {status}")
                if status == "completed":
                    return True
        print("Transcription timed out")
    return False

def test_search(interview_id):
    """Test search functionality"""
    print(f"\nTesting search for {interview_id}...")
    response = requests.get(f"{BASE_URL}/interviews/{interview_id}/search?query=React")
    print(f"Search: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Found {data['total']} search results")
        return True
    return False

def test_analysis_endpoints(interview_id):
    """Test analysis endpoints"""
    print(f"\nTesting analysis endpoints for {interview_id}...")
    
    endpoints = [
        "keywords",
        "questions", 
        "topics",
        "speaker-analysis"
    ]
    
    for endpoint in endpoints:
        response = requests.get(f"{BASE_URL}/interviews/{interview_id}/{endpoint}")
        print(f"{endpoint}: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"  {endpoint}: {len(data.get(endpoint, []))} items")

def test_export(interview_id):
    """Test export functionality"""
    print(f"\nTesting export for {interview_id}...")
    
    # Test JSON export
    response = requests.get(f"{BASE_URL}/interviews/{interview_id}/export?format=json")
    print(f"JSON export: {response.status_code}")
    
    # Test TXT export
    response = requests.get(f"{BASE_URL}/interviews/{interview_id}/export?format=txt")
    print(f"TXT export: {response.status_code}")
    
    return True

def test_tagging(interview_id):
    """Test tagging functionality"""
    print(f"\nTesting tagging for {interview_id}...")
    
    # Add a tag
    tag_data = {
        "text": "Test tag",
        "start_time": 10.0,
        "end_time": 15.0,
        "color": "#FF0000"
    }
    
    response = requests.post(f"{BASE_URL}/interviews/{interview_id}/tags", json=tag_data)
    print(f"Add tag: {response.status_code}")
    
    if response.status_code == 200:
        tag = response.json()
        tag_id = tag['id']
        print(f"Added tag with ID: {tag_id}")
        
        # Delete the tag
        response = requests.delete(f"{BASE_URL}/interviews/{interview_id}/tags/{tag_id}")
        print(f"Delete tag: {response.status_code}")
        return True
    
    return False

def main():
    """Run all tests"""
    print("Starting API tests...")
    print("=" * 50)
    
    # Test basic endpoints
    if not test_health():
        print("Health check failed!")
        return
    
    if not test_stats():
        print("Stats test failed!")
        return
    
    # Test interview management
    interview_id = test_upload()
    if not interview_id:
        print("Upload test failed!")
        return
    
    if not test_get_interview(interview_id):
        print("Get interview test failed!")
        return
    
    # Test transcription
    if not test_transcribe(interview_id):
        print("Transcription test failed!")
        return
    
    # Test analysis features
    test_search(interview_id)
    test_analysis_endpoints(interview_id)
    test_export(interview_id)
    test_tagging(interview_id)
    
    print("\n" + "=" * 50)
    print("All tests completed!")
    print(f"Test interview ID: {interview_id}")
    print("You can view the API documentation at: http://localhost:8000/docs")

if __name__ == "__main__":
    main()
