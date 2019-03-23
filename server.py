from flask import Flask, json
from flask_cors import CORS


APP = Flask(
    __name__,
    static_url_path='',
    static_folder='static'
)

CORS_OBJ = CORS(APP, resources={r"/api/*": {"origins": "*"}})

DOOR_ID = 497079449313791

DATA = {
    5823647720: "7c91befe-4ac4-49ae-a867-228383ee8fd8",
    5790323022: "54a1701d-81d2-4382-81be-1a39bb5a4569",
    4286357830: "45dbe456-bb65-4cc2-9de0-421cb2bc92e8",
    8639881096: "82732f4e-27e3-493b-8a1a-437025eb9f4f",
    3899201564: "3db3807c-6a65-4d4d-ac46-002be30185b6",
    1909294305: "71084cf9-4e42-4055-b952-f9017efac359",
}

HELP = """<h1>Test API Help</h1>
<p>Below is a description of the provided test APIs/</p>
<dl>
  <dt>/api/visitors</dt>
  <dd>A list of currently open visitor keys</dd>
  <dt>/api/visitors/{<em>visitor_key</em>}</dt>
  <dd>The lock authentication key for visitor with key <em>visitor_key</em></dd>
</dl>
"""


@APP.route("/api/")
def api_index():
    return HELP


@APP.route("/api/visitors")
def api_visitors():
    return json.jsonify(
        status="success",
        data={
            "door_id": DOOR_ID,
            "visitor_keys": list(DATA.keys()),
        },
        message=None
    )


@APP.route("/api/visitors/<int:door_id>/<int:visitor_key>/")
def api_visitors_key(door_id, visitor_key):
    try:
        return json.jsonify(
            status="success",
            data={
                "unlock_key": DATA[visitor_key],
            },
            message=None
        )
    except KeyError:
        return json.jsonify(
            status="fail",
            data=None,
            message="Invalid visitor key was requested"
        )


if __name__ == "__main__":
    APP.run(port=8080, debug=True)
