﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace myHelper {
	public class jsonArrays {
		private object[] _Cols;
		private object _Config = 0;
		//private object _Grid;
		private object _Data;

		public object[] Cols { get { return _Cols; } set { _Cols = value; } }

		public object Config { get { return _Config; } set { _Config = value; } }

		//public object Grid { get { return _Grid; } set { _Grid = value; } }

		public object Data { get { return _Data; } set { _Data = value; } }

	}
}
