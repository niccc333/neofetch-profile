import requests
import datetime

def get_most_frequent_bird(api_key):
    # Montreal region code
    region_code = 'CA-QC-MR'
    
    # We use the recent observations endpoint and look back 2 days to ensure we have yesterday's data
    url = f"https://api.ebird.org/v2/data/obs/{region_code}/recent?back=2"
    
    headers = {
        'x-ebirdapitoken': api_key
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        print(f"Error fetching data: {response.status_code} - {response.text}")
        return
        
    observations = response.json()
    
    # Use yesterday's date if before 8 AM, otherwise use today's date
    now = datetime.datetime.now()
    if now.hour < 8:
        target_date = now - datetime.timedelta(days=1)
    else:
        target_date = now
    target_date_str = target_date.strftime("%Y-%m-%d")
    
    max_count = 0
    most_frequent_bird = None
    
    for obs in observations:
        obs_date = obs.get('obsDt', '')
        if obs_date.startswith(target_date_str):
            # 'howMany' might not be present if the observer didn't specify a count (e.g. just marked 'X')
            count = obs.get('howMany', 0)
            if count > max_count:
                max_count = count
                most_frequent_bird = obs.get('comName', 'Unknown Bird')
                
    if most_frequent_bird:
        print(f"Montreal bird stats on {target_date_str}:\nMost freq. bird is: {most_frequent_bird} (Count: {max_count})")
    else:
        print(f"Montreal bird stats on {target_date_str}:\nProbably a pigeon.")

    # Fetch notable/rare birds
    notable_url = f"https://api.ebird.org/v2/data/obs/{region_code}/recent/notable?back=2"
    notable_response = requests.get(notable_url, headers=headers)
    
    if notable_response.status_code == 200:
        notable_observations = notable_response.json()
        rare_birds = set()
        rare_birds_list = []
        
        for obs in notable_observations:
            obs_date = obs.get('obsDt', '')
            if obs_date.startswith(target_date_str):
                species_name = obs.get('comName')
                if species_name and species_name not in rare_birds:
                    rare_birds.add(species_name)
                    rare_birds_list.append(species_name)
                    if len(rare_birds_list) >= 3:
                        break
                        
        if rare_birds_list:
            print(f"Notable birds:")
            for i, bird in enumerate(rare_birds_list, 1):
                print(f"{i}. {bird}")
        else:
            print(f"No notable/rare birds reported in Montreal on {target_date_str}.")
    else:
        print(f"Error fetching notable birds: {notable_response.status_code}")

if __name__ == "__main__":
    # Paste your eBird API key here
    API_KEY = '455b9bc8-be44-443f-96a3-6b7631ab7dfa'
    get_most_frequent_bird(API_KEY)
