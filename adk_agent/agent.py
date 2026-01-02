import json
from google.adk.agents.llm_agent import Agent
import re
from datetime import datetime
import os


def load_prompt_instructions():
    """
    Loads the system prompt from prompt.txt file.
    Returns the entire content as a string for LLM instructions.
    """
    try:
        prompt_path = os.path.join(os.path.dirname(__file__), "prompt.txt")
        with open(prompt_path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        print("⚠️  Warning: prompt.txt not found. Using default instructions.")
        return "You are a helpful shopping assistant. Help users find and purchase products."
    except Exception as e:
        print(f"⚠️  Error loading prompt.txt: {str(e)}")
        return "You are a helpful shopping assistant. Help users find and purchase products."


def get_user_context(userId: str):
    """
    Fetches stored user context (memory).
    Endpoint: GET /api/user-context/:userId
    """
    import requests

    try:
        res = requests.get(
            f"http://localhost:3000/api/user-context/{userId}", timeout=10
        )

        if res.status_code != 200:
            return {"success": False, "context": None}

        return {"success": True, "context": res.json()}

    except Exception as e:
        return {"success": False, "error": str(e)}


def store_user_context(
    userId: str,
    lastIntent: str = None,
    lastSearchQuery: str = None,
    lastCategory: str = None,
    lastPlatform: str = "web",
):
    """
    Stores or updates user context (AI memory).
    Endpoint: POST /api/user-context
    """
    import requests

    payload = {
        "userId": userId,
        "lastIntent": lastIntent,
        "lastSearchQuery": lastSearchQuery,
        "lastCategory": lastCategory,
        "lastPlatform": lastPlatform,
    }

    try:
        res = requests.post(
            "http://localhost:3000/api/user-context", json=payload, timeout=10
        )

        if res.status_code not in (200, 201):
            return {"success": False, "message": res.text}

        return {"success": True, "data": res.json()}

    except Exception as e:
        return {"success": False, "error": str(e)}


def get_indian_time_context():
    """
    Returns current month and major Indian seasonal / festival context.
    """
    month = datetime.now().strftime("%B")

    festival_map = {
        "January": {
            "season": "Winter / New Year",
            "festivals": ["Makar Sankranti", "Pongal", "Lohri", "Republic Day"],
        },
        "February": {"season": "Late Winter", "festivals": ["Vasant Panchami"]},
        "March": {"season": "Spring", "festivals": ["Holi", "Ramadan (may start)"]},
        "April": {
            "season": "Summer starting",
            "festivals": ["Ramadan", "Ugadi", "Gudi Padwa", "Eid (sometimes)"],
        },
        "May": {"season": "Summer", "festivals": ["Eid-ul-Fitr (sometimes)"]},
        "June": {"season": "Early Monsoon", "festivals": ["Bakrid (sometimes)"]},
        "July": {"season": "Monsoon", "festivals": ["Bakrid", "Muharram (sometimes)"]},
        "August": {
            "season": "Monsoon / Festive prep",
            "festivals": ["Raksha Bandhan", "Janmashtami", "Independence Day"],
        },
        "September": {
            "season": "Festive season begins",
            "festivals": ["Ganesh Chaturthi", "Onam"],
        },
        "October": {
            "season": "Peak festive season",
            "festivals": ["Navratri", "Durga Puja", "Dussehra"],
        },
        "November": {
            "season": "Festive & wedding season",
            "festivals": ["Diwali", "Bhai Dooj", "Chhath Puja"],
        },
        "December": {
            "season": "Year-end celebrations",
            "festivals": ["Christmas", "New Year prep"],
        },
    }

    return {
        "month": month,
        "season": festival_map.get(month, {}).get("season", "General season"),
        "festivals": festival_map.get(month, {}).get("festivals", []),
    }


def get_user_orders(userId: str):
    """
    Fetches past orders of the user.
    Endpoint: GET /api/orders/:userId
    """
    import requests

    res = requests.get(f"http://localhost:3000/api/orders/{userId}", timeout=10)

    if res.status_code != 200:
        return {"success": False, "message": "Failed to fetch orders"}

    return {"success": True, "data": res.json()}


def add_to_cart(userId: str, productId: str):
    """
    Adds a product to the user's cart.
    Endpoint: POST /api/cart
    """
    import requests

    payload = {"userId": userId, "productId": productId}

    res = requests.post("http://localhost:3000/api/cart", json=payload, timeout=10)

    if res.status_code not in (200, 201):
        return {
            "success": False,
            "message": "Failed to add product to cart",
            "error": res.text,
        }

    return {"success": True, "data": res.json()}


def get_cart(userId: str):
    """
    Fetches all items in the user's cart.
    Endpoint: GET /api/cart/:userId
    """
    import requests

    res = requests.get(f"http://localhost:3000/api/cart/{userId}", timeout=10)

    if res.status_code != 200:
        return {"success": False, "message": "Failed to fetch cart"}

    return {"success": True, "data": res.json()}


def update_cart_item(userId: str, productId: str, quantity: int):
    """
    Updates quantity of a product in the cart.
    Endpoint: PUT /api/cart
    """
    import requests

    payload = {"userId": userId, "productId": productId, "quantity": quantity}

    res = requests.put("http://localhost:3000/api/cart", json=payload, timeout=10)

    if res.status_code != 200:
        return {"success": False, "message": "Failed to update cart"}

    return {"success": True, "data": res.json()}


def remove_from_cart(userId: str, productId: str):
    """
    Removes a product from the user's cart.
    Endpoint: DELETE /api/cart
    """
    import requests

    payload = {"userId": userId, "productId": productId}

    res = requests.delete("http://localhost:3000/api/cart", json=payload, timeout=10)

    if res.status_code != 200:
        return {"success": False, "message": "Failed to remove item from cart"}

    return {"success": True, "data": res.json()}


def checkout_order(userId: str, address: str):
    """
    Creates an order and completes checkout for the user.
    Endpoint: POST /api/checkout
    """
    import requests

    payload = {"userId": userId, "address": address}

    res = requests.post("http://localhost:3000/api/checkout", json=payload, timeout=10)

    print("CHECKOUT PAYLOAD:", payload)
    print("CHECKOUT STATUS:", res.status_code)
    print("CHECKOUT RESPONSE:", res.text)

    if res.status_code not in (200, 201):
        return {"success": False, "message": "Checkout failed. Please try again."}

    return {"success": True, "data": res.json()}


def normalize_query(query: str):
    query = query.lower()
    query = re.sub(r"[^\w\s]", "", query)  # remove punctuation
    return query.split()


def login_user(email: str, password: str):
    """
    Logs in a user using email and password.
    Endpoint: POST /api/users/login
    """
    import requests

    payload = {"email": email, "password": password}

    res = requests.post("http://localhost:3000/api/users/login", json=payload)

    if res.status_code != 200:
        return {"success": False, "message": "Invalid email or password"}

    return {"success": True, "data": res.json()}


def register_user(
    name: str,
    email: str,
    password: str,
    role: str,
    platform: str,
    platformUserId: str,
):

    import requests

    payload = {
        "name": name,
        "email": email,
        "password": password,
        "role": role,
        "platform": platform,
        "platformUserId": platformUserId,
    }

    res = requests.post("http://localhost:3000/api/users", json=payload, timeout=10)

    print("REGISTER STATUS:", res.status_code)
    print("REGISTER RESPONSE:", res.text)

    if res.status_code not in (200, 201):
        return {"success": False, "message": res.text}

    return {"success": True, "data": res.json()}


def get_all_products():
    """
    Returns all products from backend.
    Endpoint: GET http://localhost:3000/api/products
    """
    import requests

    res = requests.get("http://localhost:3000/api/products")
    return res.json()


def get_products_below_price(max_price: float):
    """
    Returns all products with price <= max_price
    """
    all_products = get_all_products()
    filtered = [p for p in all_products if p["price"] <= max_price]
    return filtered


def search_product_by_keyword(query: str):
    """
    Returns products whose title or description contains the keyword.
    """
    all_products = get_all_products()
    keywords = normalize_query(query)

    def product_text(product):
        texts = [
            product.get("title", ""),
            product.get("description", ""),
            product.get("attributes", {}).get("occasion", ""),
            product.get("attributes", {}).get("fabric", ""),
            product.get("attributes", {}).get("color", ""),
        ]

        texts += [cat.get("name", "") for cat in product.get("categoryIds", [])]

        return " ".join(texts).lower()

    results = []
    for product in all_products:
        text = product_text(product)
        if any(k in text for k in keywords):
            results.append(product)

    return results


def checkout(userId: str, address: str):
    """
    Places an order for the user using items in the cart.
    Endpoint: POST /api/checkout
    """
    import requests

    payload = {"userId": userId, "address": address}

    res = requests.post("http://localhost:3000/api/checkout", json=payload, timeout=10)

    if res.status_code not in (200, 201):
        return {"success": False, "message": "Checkout failed", "error": res.text}

    return {"success": True, "data": res.json()}


# Load system prompt from prompt.txt
_system_prompt = load_prompt_instructions()

root_agent = Agent(
    model="gemini-2.5-flash-lite",
    name="my_agent",
    description="An AI sales agent that manages the complete customer shopping journey end-to-end through natural conversation.",
    instruction=_system_prompt,
    tools=[
        login_user,
        register_user,
        get_all_products,
        search_product_by_keyword,
        add_to_cart,
        get_cart,
        update_cart_item,
        remove_from_cart,
        checkout_order,
        get_user_orders,
        get_indian_time_context,
        get_user_context,  # 🧠 memory fetch
        store_user_context,  # 🧠 memory store
    ],
)
